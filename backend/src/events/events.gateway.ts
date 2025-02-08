import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { join } from 'path';
import { ActivitiesService } from 'src/activities/activities.service';

interface DetectionMessage {
  type: 'monitoring_start' | 'person_detected' | 'error';
  timestamp: string;
  data: any;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private pythonProcess: ChildProcessWithoutNullStreams | null = null;
  private outputBuffer: string = '';
  private activeMonitoringSession: {
    deviceId: number;
    activityId: number;
  } | null = null;

  constructor(private readonly activitiesService: ActivitiesService) {}

  async initialize() {
    if (!this.pythonProcess) {
      await this.initializePythonProcess();
    }
  }

  private async initializePythonProcess() {
    if (this.pythonProcess) {
      console.log('Python process already exists');
      return;
    }

    const isProd = process.env.NODE_ENV === 'production';
    const scriptPath = join(
      process.cwd(),
      isProd ? 'dist' : 'src',
      'events',
      'scripts',
      'object_detection.py',
    );

    try {
      const pythonPath = process.env.PYTHON_PATH;
      this.pythonProcess = spawn(pythonPath, [scriptPath]);
      console.log('Python process started with PID:', this.pythonProcess.pid);

      this.pythonProcess.stdout.on('data', async (data) => {
        const output = data.toString();
        this.outputBuffer += output;

        try {
          const lines = this.outputBuffer.split('\n');
          this.outputBuffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const message = JSON.parse(line) as DetectionMessage;

              switch (message.type) {
                case 'monitoring_start':
                  console.log('Monitoring started:', message.data.message);
                  this.server.emit('monitoring-status', {
                    status: 'active',
                    timestamp: message.timestamp,
                    message: message.data.message,
                  });
                  break;

                case 'person_detected':
                  console.log('Processing person detection:', {
                    hasDetections: message.data.detections.length > 0,
                    activeActivityId: this.activeMonitoringSession?.activityId,
                    timestamp: message.timestamp,
                  });

                  this.server.emit('detection-alert', {
                    timestamp: message.timestamp,
                    detections: message.data.detections,
                    alert_level: message.data.alert_level,
                  });

                  if (this.activeMonitoringSession?.activityId) {
                    try {
                      await this.activitiesService.appendActivityLog(
                        this.activeMonitoringSession.activityId,
                        {
                          type: 'person_detected',
                          timestamp: new Date(message.timestamp),
                          detections: message.data.detections,
                        },
                      );
                    } catch (error) {
                      console.error('Failed to save detection log:', error);
                    }
                  }
                  break;

                case 'error':
                  if (this.activeMonitoringSession?.activityId) {
                    await this.activitiesService.appendActivityLog(
                      this.activeMonitoringSession.activityId,
                      {
                        type: 'system_error',
                        timestamp: new Date(message.timestamp),
                        details: {
                          error: message.data.error,
                          type: message.data.type,
                        },
                      },
                    );
                  }
                  console.error('Detection error:', message.data.error);
                  this.server.emit('detection-error', {
                    timestamp: message.timestamp,
                    error: message.data.error,
                    type: message.data.type,
                  });
                  break;
              }
            } catch (err) {
              if (this.activeMonitoringSession?.activityId) {
                await this.activitiesService.appendActivityLog(
                  this.activeMonitoringSession.activityId,
                  {
                    type: 'parsing_error',
                    timestamp: new Date(),
                    details: {
                      error: err.message,
                      type: 'json_parse_error',
                    },
                  },
                );
              }
              continue;
            }
          }
        } catch (error) {
          console.error('Error processing Python output:', error);
          if (this.activeMonitoringSession?.activityId) {
            await this.activitiesService.appendActivityLog(
              this.activeMonitoringSession.activityId,
              {
                type: 'system_error',
                timestamp: new Date(),
                details: {
                  error: error.message,
                  type: 'python_process_error',
                },
              },
            );
          }
        }
      });

      this.pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.log('Python stderr:', error);
        if (!error.includes('requirements:')) {
          console.error('Python script error:', error);
        }
      });

      this.pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        this.pythonProcess = null;
      });

      this.pythonProcess.on('error', (error) => {
        console.error('Python process error:', error);
        this.pythonProcess = null;
      });
    } catch (error) {
      console.error('Failed to initialize Python process:', error);
      this.pythonProcess = null;
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.initialize();
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('monitoring-start')
  async handleMonitoringStart(@MessageBody() data: any) {
    console.log('Received monitoring-start event with data:', data);

    if (!data.sessionId || !data.activityId) {
      console.error('Invalid monitoring start data received');
      return;
    }

    this.activeMonitoringSession = {
      deviceId: data.sessionId,
      activityId: data.activityId,
    };

    console.log(
      'Active monitoring session set to:',
      this.activeMonitoringSession,
    );

    if (!this.pythonProcess) {
      await this.initializePythonProcess();
    }
  }

  @SubscribeMessage('video-frame')
  async handleVideoFrame(
    @MessageBody() data: Buffer,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (!client || !client.connected) {
      console.error('Invalid client connection');
      return;
    }

    try {
      const filePath = path.join('/tmp', `frame-${Date.now()}.jpg`);
      await fs.promises.writeFile(filePath, data);
      console.log('Frame saved to:', filePath);

      if (!this.pythonProcess) {
        console.log('Initializing Python process...');
        await this.initializePythonProcess();
      }

      if (this.pythonProcess && this.pythonProcess.stdin.writable) {
        console.log('Sending frame path to Python:', filePath);
        this.pythonProcess.stdin.write(filePath + '\n');
      } else {
        console.error('Python process not ready');
      }

      setTimeout(async () => {
        try {
          await fs.promises.unlink(filePath);
          console.log('Cleaned up frame:', filePath);
        } catch (err) {
          console.error('Error cleaning up file:', err);
        }
      }, 500);
    } catch (error) {
      console.error('Error handling video frame:', error);
      throw error;
    }
  }

  @SubscribeMessage('streaming-finished')
  handleStreamingFinished(): void {
    console.log('Streaming finished');
    this.server.emit('streaming-ended', 'Streaming has ended.');

    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
    this.activeMonitoringSession = null;
  }

  async onModuleDestroy() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
  }
}
