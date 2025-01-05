import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';

export enum ActivityType {
  CAMERA_ON = 'camera_on',
  CAMERA_OFF = 'camera_off',
  MOTION_DETECTED = 'motion_detected',
  RECORDING_START = 'recording_start',
  RECORDING_STOP = 'recording_stop',
  OBJECT_DETECTED = 'object_detected',
  DEVICE_CONNECTED = 'device_connected',
  DEVICE_DISCONNECTED = 'device_disconnected',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Device, (device) => device.activity)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @Column()
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.CAMERA_OFF,
  })
  activityType: ActivityType;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
