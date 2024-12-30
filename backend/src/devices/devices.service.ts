import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto, user: User): Promise<Device> {
    const device = this.devicesRepository.create(createDeviceDto);
    const deviceUser = await this.usersService.findOne(user.id);
    if (!user) {
      throw new Error('User not found');
    }
    device.user = deviceUser;
    return await this.devicesRepository.save(device);
  }

  async findMyDevices(userId: number): Promise<Device[]> {
    return await this.devicesRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findAllDevices(): Promise<Device[]> {
    return await this.devicesRepository.find();
  }

  async findOne(id: number): Promise<Device | undefined> {
    return await this.devicesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device | undefined> {
    const device = await this.devicesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    await this.devicesRepository.update(id, updateDeviceDto);
    return await this.devicesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.devicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
  }
}
