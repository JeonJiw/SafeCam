import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService } from './email.service';
import { Device } from 'src/devices/entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MonitoringService {
  private sessions = new Map<
    string,
    {
      userId: number;
      verificationCode: string;
      startTime: Date;
      status: string;
      detectionLogs?: any[];
    }
  >();

  constructor(
    private emailService: EmailService,
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    private configService: ConfigService,
  ) {}

  async startMonitoring(
    userId: number,
    createMonitoringDto: CreateMonitoringDto,
  ) {
    const { deviceId, verificationCode } = createMonitoringDto;

    const existingSession = Array.from(this.sessions.values()).find(
      (session) => session.userId === userId,
    );

    if (existingSession) {
      throw new ConflictException(
        'You already have an active streaming session',
      );
    }

    this.sessions.set(deviceId, {
      userId,
      verificationCode,
      startTime: new Date(),
      status: 'active',
      detectionLogs: [],
    });

    try {
      const Url = process.env.FRONTEND_URL;
      const monitoringUrl = `${Url}/monitoring`;

      await this.emailService.sendVerificationCode(
        verificationCode,
        userId,
        monitoringUrl,
      );

      return {
        success: true,
        message: 'Monitoring session started successfully',
      };
    } catch (error) {
      this.sessions.delete(deviceId);
      throw error;
    }
  }
  async checkStreamAccess(deviceId: string, userId: number) {
    const session = this.sessions.get(deviceId);

    if (!session) {
      throw new NotFoundException('No active streaming session found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this stream');
    }

    return session;
  }
  async endMonitoring(deviceId: string, code: string) {
    const session = this.sessions.get(deviceId);
    console.log('Ending monitoring for device:', deviceId);
    console.log('Available sessions:', Array.from(this.sessions.keys()));

    if (!session) {
      throw new NotFoundException('No active monitoring session found');
    }

    console.log('Comparing codes:', {
      provided: code,
      stored: session.verificationCode,
    });

    console.log('session.verificationCode:', session.verificationCode);
    if (session.verificationCode !== code) {
      return {
        success: false,
        message: 'Invalid verification code',
      };
    }
    const sessionInfo = { ...session };
    this.sessions.delete(deviceId);

    return {
      success: true,
      message: 'Monitoring ended successfully',
      sessionInfo,
    };
  }

  async resetSession(userId: number) {
    for (const [deviceId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(deviceId);
      }
    }

    return {
      success: true,
      message: 'Session reset successfully',
    };
  }

  async logFailedAttempt(attemptData: any) {
    const { image, timestamp } = attemptData;

    if (image) {
      const fileName = `failed-attempt-${timestamp}.jpg`;
      await this.saveImage(image, fileName);
    }

    return {
      success: true,
      message: 'Failed attempt logged',
    };
  }

  private async saveImage(image: Buffer, fileName: string) {
    const uploadPath = './uploads/failed-attempts';
    const fullPath = path.join(uploadPath, fileName);
    await fs.promises.writeFile(fullPath, image);
    return fileName;
  }
}
