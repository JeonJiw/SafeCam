import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  deviceId: string;

  @ManyToOne(() => User, (user) => user.devices, { eager: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  deviceName: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: true })
  cameraEnabled: boolean;

  @Column({ default: false })
  recordingEnabled: boolean;

  @Column({ default: 'user' })
  permissionLevel: string; // "admin", "user", "guest"

  @Column({ nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    this.deviceId = uuidv4();
  }
}
