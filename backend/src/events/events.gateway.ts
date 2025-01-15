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

  constructor() {
    // Python 프로세스 초기화
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
      this.pythonProcess = spawn(
        '/opt/homebrew/Caskroom/miniconda/base/envs/safecam/bin/python',
        [scriptPath],
      );
      console.log(
        'Initialized Python process with PID:',
        this.pythonProcess.pid,
      );

      this.pythonProcess.stdout.on('data', (output) => {
        console.log(`Python script output: ${output}`);
        this.server.emit('detection-result', output.toString());
      });

      this.pythonProcess.stderr.on('data', (error) => {
        console.error(`Python script error: ${error.toString()}`);
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

      // 파일 경로를 Python 프로세스에 전달
      if (this.pythonProcess && this.pythonProcess.stdin.writable) {
        this.pythonProcess.stdin.write(filePath + '\n');
      }

      // 파일 정리
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
    this.server.emit(
      'streaming-ended',
      'Streaming has ended and file is saved.',
    );

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
