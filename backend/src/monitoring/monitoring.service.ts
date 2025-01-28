import {
  ConflictException,
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
  ) {}

  async startMonitoring(
    userId: number,
    createMonitoringDto: CreateMonitoringDto,
  ) {
    const { deviceId, verificationCode } = createMonitoringDto;
    // 디버깅을 위한 로그 추가
    console.log('Starting monitoring for device:', deviceId);
    console.log('Current sessions:', this.sessions);

    if (this.sessions.has(deviceId)) {
      throw new ConflictException('Active monitoring session already exists');
    }

    const device = await this.devicesRepository.findOne({
      where: { deviceId },
      relations: ['user'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.user.id !== userId) {
      throw new ConflictException('Not authorized to monitor this device');
    }

    // 세션 저장시 명확한 타입 지정
    this.sessions.set(deviceId, {
      userId,
      verificationCode,
      startTime: new Date(),
      status: 'active',
      detectionLogs: [],
    });
    console.log('sessions Map (after start):', this.sessions); // 추가
    try {
      await this.emailService.sendVerificationCode(verificationCode, userId);
      return {
        success: true,
        message: 'Monitoring session started successfully',
      };
    } catch (error) {
      this.sessions.delete(deviceId);
      throw error;
    }
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
