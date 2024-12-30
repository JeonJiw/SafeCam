import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const server = app.getHttpServer();
  const router = server._events.request._router;

  if (router && router.stack) {
    const routes = router.stack
      .filter((r) => r.route)
      .map((r) => {
        return {
          path: r.route.path,
          method: r.route.stack[0].method,
        };
      });
    console.log(routes);
  } else {
    console.log('라우터 스택을 찾을 수 없습니다.');
  }
}
bootstrap();
