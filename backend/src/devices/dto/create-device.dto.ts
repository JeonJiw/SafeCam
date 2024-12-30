import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

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
