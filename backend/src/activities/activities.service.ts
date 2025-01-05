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

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  async createActivity(
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const { activityType, timestamp, description, metadata, deviceId, userId } =
      createActivityDto;

    const activity = this.activitiesRepository.create({
      activityType,
      timestamp,
      description,
      metadata,
      device: { id: deviceId },
      user: { id: userId },
    });

    return await this.activitiesRepository.save(activity);
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
}
