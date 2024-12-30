import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('devices')
@UseGuards(AuthGuard('jwt'))
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  async create(
    @Body() createDeviceDto: CreateDeviceDto,
    @Req() req,
  ): Promise<Device> {
    const user = req.user;
    return await this.devicesService.create(createDeviceDto, user);
  }

  @Get('mydevices')
  async findAll(@Req() req): Promise<Device[]> {
    return await this.devicesService.findMyDevices(req.user.userId);
  }

  @Get()
  @UseGuards(AdminGuard)
  async findAllDevices(@Req() req): Promise<Device[]> {
    console.log(req);
    return await this.devicesService.findAllDevices();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Device | undefined> {
    return await this.devicesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device | undefined> {
    return await this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.devicesService.remove(id);
  }
}
