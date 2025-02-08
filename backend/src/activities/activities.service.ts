import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { GetActivitiesFilterDto } from './dto/get-activities.filter.dto';
import { User } from 'src/users/entities/user.entity';
import { MonitoringSession } from 'src/monitoring/entities/monitoring-session.entity';
import { AppendActivityLogDto } from './dto/append-activity-log.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    @InjectRepository(MonitoringSession)
    private monitoringSessionRepository: Repository<MonitoringSession>,
  ) {}

  async createActivity(
    monitoringSessionId: number,
    log: any,
  ): Promise<Activity> {
    const session = await this.monitoringSessionRepository.findOne({
      where: { id: monitoringSessionId },
      relations: ['user', 'device'],
    });

    if (!session) {
      throw new NotFoundException('Monitoring session not found');
    }

    const activity = this.activitiesRepository.create({
      user: session.user,
      device: session.device,
      monitoringSession: session,
      log: log,
    });

    return this.activitiesRepository.save(activity);
  }

  async getActivities(filterDto: GetActivitiesFilterDto): Promise<Activity[]> {
    const { userId, deviceId, startDate, endDate, activityType } = filterDto;

    const whereClause: any = {};

    if (userId) {
      whereClause.user = { id: userId };
    }

    if (deviceId) {
      whereClause.device = { id: deviceId };
    }

    if (startDate && endDate) {
      whereClause.timestamp = Between(startDate, endDate);
    } else if (startDate) {
      whereClause.timestamp = startDate;
    }

    if (activityType) {
      whereClause.activityType = Like(`%${activityType}%`);
    }

    return await this.activitiesRepository.find({
      where: whereClause,
      relations: ['user', 'device'],
    });
  }

  async getActivityById(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['user', 'device'],
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID "${id}" not found`);
    }
    return activity;
  }

  async deleteActivity(id: number): Promise<void> {
    const result = await this.activitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Activity with ID "${id}" not found`);
    }
  }

  async appendActivityLog(
    activityId: number,
    newLog: AppendActivityLogDto,
  ): Promise<void> {
    const activity = await this.activitiesRepository.findOne({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    activity.log.logs.push({
      type: newLog.type,
      timestamp: newLog.timestamp,
      detections: newLog.detections,
    });

    activity.log.lastUpdated = new Date();

    await this.activitiesRepository.save(activity);
  }
}
