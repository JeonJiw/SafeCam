import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  cameraEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  recordingEnabled?: boolean;
}
