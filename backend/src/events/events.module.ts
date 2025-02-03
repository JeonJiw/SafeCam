import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [ActivitiesModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
