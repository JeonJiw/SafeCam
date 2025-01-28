// monitoring-session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MonitoringSession } from './monitoring-session.entity';

@Entity()
export class FailedAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MonitoringSession)
  session: MonitoringSession;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  attemptType: string; // 'INVALID_CODE' | 'UNAUTHORIZED_ACCESS'

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;
}
