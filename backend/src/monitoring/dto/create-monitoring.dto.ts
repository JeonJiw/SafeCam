import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMonitoringDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
