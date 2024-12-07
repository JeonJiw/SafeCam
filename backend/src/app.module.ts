import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'dev'),
        password: configService.get<string>(
          'DB_PASSWORD',
          'Pass_safe_cam_word',
        ),
        database: configService.get<string>('DB_DATABASE', 'safecam'),
        synchronize: true, // 개발 환경에서는 true, 프로덕션에서는 false
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
