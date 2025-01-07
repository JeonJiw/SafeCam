import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as fs from 'fs';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 비디오 청크를 처리하고 파일에 이어서 기록
  @SubscribeMessage('video-chunk')
  handleVideoChunk(@MessageBody() data: Buffer, client: Socket): void {
    console.log(`Received video chunk: ${data.length} bytes`);

    const filePath = `received_video_${Date.now()}.webm`; // 파일 이름에 타임스탬프 포함
    const fileStream = fs.createWriteStream(filePath, { flags: 'a' }); // append 모드로 파일 열기
    fileStream.write(data); // 비디오 청크 데이터를 파일에 기록
    fileStream.end(); // 파일 닫기

    // 클라이언트에게 'video-received' 메시지 전송
    this.server.emit('video-received', 'Video chunk received and saved');
  }

  // 스트리밍 종료 시 파일 처리
  @SubscribeMessage('streaming-finished')
  handleStreamingFinished(client: Socket): void {
    console.log('Streaming finished.');
    this.server.emit(
      'streaming-ended',
      'Streaming has ended and file is saved.',
    );
  }
}
