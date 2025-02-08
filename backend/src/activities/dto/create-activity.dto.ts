import { IsNumber, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { ActivityLogDto } from './activity-log.dto';

export class CreateActivityDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  deviceId: number;

  @IsNumber()
  monitoringSessionId: number;

  @ValidateNested()
  @Type(() => ActivityLogDto)
  log: {
    logs: ActivityLogDto[];
    lastUpdated: Date;
  };
}
