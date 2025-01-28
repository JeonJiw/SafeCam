import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as ngrok from 'ngrok';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useWebSocketAdapter(new IoAdapter(app));
  const port = 3002;
  await app.listen(port);
  console.log(`Server is listening on port ${port}`);

  // 개발 환경에서 ngrok 설정
  if (process.env.NODE_ENV === 'development') {
    try {
      const url = await ngrok.connect({
        addr: port,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });
      console.log('Ngrok tunnel is running:', url);

      // 환경 변수에 ngrok URL 저장
      process.env.PUBLIC_URL = url;
    } catch (error) {
      console.error('Ngrok tunnel error:', error);
    }
  }
}
bootstrap();
