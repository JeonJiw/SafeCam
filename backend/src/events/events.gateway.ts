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

interface DetectionMessage {
  type: 'monitoring_start' | 'person_detected' | 'error';
  timestamp: string;
  data: any;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private pythonProcess: ChildProcessWithoutNullStreams | null = null;
  private isProcessing: boolean = false;
  private outputBuffer: string = '';

  constructor() {
    this.initializePythonProcess();
  }

  private async initializePythonProcess() {
    if (this.pythonProcess) {
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
      console.log(
        'Initialized Python process with PID:',
        this.pythonProcess.pid,
      );

      this.pythonProcess.stdout.on('data', (data) => {
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
                  console.log(
                    'Person detected:',
                    message.data.detections.length > 0
                      ? 'Approaching person detected'
                      : 'No immediate threat',
                  );
                  this.server.emit('detection-alert', {
                    timestamp: message.timestamp,
                    detections: message.data.detections,
                    alert_level: message.data.alert_level,
                  });
                  break;

                case 'error':
                  console.error('Detection error:', message.data.error);
                  this.server.emit('detection-error', {
                    timestamp: message.timestamp,
                    error: message.data.error,
                    type: message.data.type,
                  });
                  break;
              }
            } catch (err) {
              continue;
            }
          }
        } catch (error) {
          console.error('Error processing Python output:', error);
        }
      });

      this.pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        // ignore requirements msgs
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
    if (!this.pythonProcess) {
      this.initializePythonProcess();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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

    if (this.isProcessing) {
      return;
    }

    try {
      this.isProcessing = true;
      const filePath = path.join('/tmp', `frame-${Date.now()}.jpg`);
      await fs.promises.writeFile(filePath, data);

      if (!this.pythonProcess) {
        await this.initializePythonProcess();
      }

      if (this.pythonProcess && this.pythonProcess.stdin.writable) {
        this.pythonProcess.stdin.write(filePath + '\n');
      }

      setTimeout(async () => {
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error('Error cleaning up file:', err);
        }
        this.isProcessing = false;
      }, 500);
    } catch (error) {
      console.error('Error handling video frame:', error);
      this.isProcessing = false;
      throw error;
    }
  }

  @SubscribeMessage('streaming-finished')
  handleStreamingFinished(client: Socket): void {
    console.log('Streaming finished.');
    this.server.emit('streaming-ended', 'Streaming has ended.');

    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
  }

  async onModuleDestroy() {
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
  }
}
