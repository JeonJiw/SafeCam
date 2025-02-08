import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { UsersModule } from 'src/users/users.module';
import { Activity } from './entities/activity.entity';
import { MonitoringSession } from 'src/monitoring/entities/monitoring-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, MonitoringSession]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
