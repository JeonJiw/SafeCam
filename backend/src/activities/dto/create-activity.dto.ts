import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDate,
  IsJSON,
  IsObject,
} from 'class-validator';

import { ActivityType } from '../entities/activity.entity';
import { Transform } from 'class-transformer';

export class CreateActivityDto {
  @IsNotEmpty()
  deviceId: number;

  @IsOptional()
  userId: number;

  @IsNotEmpty()
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  timestamp: Date;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsObject()
  metadata: object;
}
