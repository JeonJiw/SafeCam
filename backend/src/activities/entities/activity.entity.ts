import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { User } from '../../users/entities/user.entity';
import { MonitoringSession } from '../../monitoring/entities/monitoring-session.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Device, (device) => device.activities)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ManyToOne(() => MonitoringSession, (session) => session.activities)
  @JoinColumn({ name: 'monitoring_session_id' })
  monitoringSession: MonitoringSession;

  @Column({ type: 'jsonb' })
  log: {
    logs: Array<{
      type: string;
      timestamp: Date;
      detections?: Array<{
        confidence: number;
        boundingBox: {
          x: number;
          y: number;
          width: number;
          height: number;
        };
      }>;
      verification?: {
        success: boolean;
      };
    }>;
    lastUpdated: Date;
  };
}
