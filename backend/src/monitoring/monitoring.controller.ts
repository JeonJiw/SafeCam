// monitoring.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LogFailedAttemptDto } from './dto/failed-attempt.dto';

@Controller('monitoring')
@UseGuards(AuthGuard('jwt'))
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('start')
  async startMonitoring(
    @Body() createMonitoringDto: CreateMonitoringDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.monitoringService.startMonitoring(userId, createMonitoringDto);
  }

  @Post('end')
  async endMonitoring(@Body() verifyCodeDto: VerifyCodeDto, @Req() req) {
    const userId = req.user.userId;
    return this.monitoringService.endMonitoring(
      verifyCodeDto.deviceId,
      verifyCodeDto.code,
    );
  }

  @Post('reset-session')
  async resetSession(@Req() req) {
    const userId = req.user.userId;
    return this.monitoringService.resetSession(userId);
  }

  @Post('log-attempt')
  @UseInterceptors(FileInterceptor('image'))
  async logFailedAttempt(
    @UploadedFile() image: Express.Multer.File,
    @Body() logFailedAttemptDto: LogFailedAttemptDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.monitoringService.logFailedAttempt({
      userId,
      image,
      ...logFailedAttemptDto,
    });
  }
}
