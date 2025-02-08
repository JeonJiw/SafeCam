import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Device } from '../../devices/entities/device.entity';
import { Activity } from 'src/activities/entities/activity.entity';

@Entity()
export class MonitoringSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Device)
  device: Device;

  @Column()
  verificationCode: string;

  @CreateDateColumn()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ default: 'active' })
  status: string; // 'active' | 'ended'

  @OneToMany(() => Activity, (activity) => activity.monitoringSession)
  activities: Activity[];
}
