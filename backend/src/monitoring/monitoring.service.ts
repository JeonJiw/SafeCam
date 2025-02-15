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
import { MonitoringSession } from './entities/monitoring-session.entity';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class MonitoringService {
  private activeSessions = new Map<
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
    @InjectRepository(MonitoringSession)
    private monitoringSessionRepository: Repository<MonitoringSession>,
    private readonly activitiesService: ActivitiesService,
    private configService: ConfigService,
  ) {}

  async startMonitoring(
    userId: number,
    createMonitoringDto: CreateMonitoringDto,
  ) {
    const { deviceId, verificationCode } = createMonitoringDto;

    const existingMemorySession = Array.from(this.activeSessions.values()).find(
      (session) => session.userId === userId,
    );

    const existingDbSession = await this.monitoringSessionRepository.findOne({
      where: {
        user: { id: userId },
        status: 'active',
      },
    });

    if (existingMemorySession || existingDbSession) {
      throw new ConflictException(
        'You already have an active streaming session',
      );
    }

    const device = await this.devicesRepository.findOne({
      where: { deviceId },
      relations: ['user'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    const session = this.monitoringSessionRepository.create({
      user: { id: userId },
      device: { id: device.id },
      verificationCode,
      status: 'active',
    });

    try {
      const savedSession = await this.monitoringSessionRepository.save(session);
      console.log('Session created and saved: ', session);

      this.activeSessions.set(deviceId, {
        userId,
        verificationCode,
        startTime: savedSession.startTime,
        status: 'active',
        detectionLogs: [],
      });

      const activity = await this.activitiesService.createActivity(session.id, {
        logs: [
          {
            type: 'monitoring_start',
            timestamp: new Date(),
          },
        ],
        lastUpdated: new Date(),
      });
      console.log('Activity created and saved: ', activity);

      const Url = process.env.FRONTEND_URL;
      const monitoringUrl = `${Url}/monitoring`;

      await this.emailService.sendVerificationCode(
        verificationCode,
        userId,
        monitoringUrl,
      );
      console.log(
        'Backend Return - sessionId, activityId: ',
        savedSession.id,
        activity.id,
      );
      return {
        success: true,
        message: 'Monitoring session started successfully',
        sessionId: savedSession.id,
        activityId: activity.id,
      };
    } catch (error) {
      this.activeSessions.delete(deviceId);
      await this.monitoringSessionRepository.delete(session.id);
      throw error;
    }
  }

  async endMonitoring(deviceId: string, code: string) {
    const memorySession = this.activeSessions.get(deviceId);
    if (!memorySession) {
      throw new NotFoundException('No active monitoring session found');
    }

    if (memorySession.verificationCode !== code) {
      return {
        success: false,
        message: 'Invalid verification code',
      };
    }

    try {
      // Update database session
      const dbSession = await this.monitoringSessionRepository.findOne({
        where: {
          device: { deviceId },
          status: 'active',
        },
      });

      if (dbSession) {
        dbSession.status = 'ended';
        dbSession.endTime = new Date();
        await this.monitoringSessionRepository.save(dbSession);
      }

      const sessionInfo = { ...memorySession };
      this.activeSessions.delete(deviceId);

      return {
        success: true,
        message: 'Monitoring ended successfully',
        sessionInfo,
      };
    } catch (error) {
      console.error('Error ending monitoring session:', error);
      throw error;
    }
  }

  async resetSession(userId: number) {
    try {
      // Update all active sessions in database
      await this.monitoringSessionRepository.update(
        {
          user: { id: userId },
          status: 'active',
        },
        {
          status: 'ended',
          endTime: new Date(),
        },
      );

      for (const [deviceId, session] of this.activeSessions.entries()) {
        if (session.userId === userId) {
          this.activeSessions.delete(deviceId);
        }
      }

      return {
        success: true,
        message: 'Session reset successfully',
      };
    } catch (error) {
      console.error('Error resetting sessions:', error);
      throw error;
    }
  }

  async checkStreamAccess(deviceId: string, userId: number) {
    const session = this.activeSessions.get(deviceId);

    if (!session) {
      throw new NotFoundException('No active streaming session found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have access to this stream');
    }

    return session;
  }

  async logFailedAttempt(attemptData: any) {
    const { image, timestamp } = attemptData;
    let fileName: string | undefined;

    if (image) {
      fileName = `failed-attempt-${timestamp}.jpg`;
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
