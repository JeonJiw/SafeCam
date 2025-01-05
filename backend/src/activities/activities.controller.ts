import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { GetActivitiesFilterDto } from './dto/get-activities.filter.dto';

@Controller('activities')
@UseGuards(AuthGuard('jwt'))
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async createActivity(
    @Body(ValidationPipe) createActivityDto: CreateActivityDto,
    @Req() req,
  ): Promise<Activity> {
    createActivityDto.userId = req.user.userId;
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Get('myactivities')
  async getMyActivities(@Req() req): Promise<Activity[]> {
    const userId = req.user.userId;
    return this.activitiesService.getActivities({ userId });
  }

  @Get()
  @UseGuards(AdminGuard)
  async getActivities(
    @Query(ValidationPipe) filterDto: GetActivitiesFilterDto,
  ): Promise<Activity[]> {
    return this.activitiesService.getActivities(filterDto);
  }

  @Get('/:id')
  @UseGuards(AdminGuard)
  async getActivityById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Activity> {
    return this.activitiesService.getActivityById(id);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteActivity(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.activitiesService.deleteActivity(id);
  }
}
