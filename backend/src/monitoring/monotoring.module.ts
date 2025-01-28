import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { EmailService } from './email.service';
import { MonitoringSession } from './entities/monitoring-session.entity';
import { FailedAttempt } from './entities/failed-attempt.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { Device } from '../devices/entities/device.entity';
import { UsersModule } from '../users/users.module'; // 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitoringSession, FailedAttempt, Device]),
    MulterModule.register({
      dest: './uploads/failed-attempts',
    }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService, EmailService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
