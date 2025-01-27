import { Activity } from 'src/activities/entities/activity.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  deviceId: string;

  @ManyToOne(() => User, (user) => user.devices, { eager: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  deviceName: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'user' })
  permissionLevel: string; // "admin", "user", "guest"

  @Column({ nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Activity, (activity) => activity.device)
  activity: Activity[];
}
