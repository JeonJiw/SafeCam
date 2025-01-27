import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDeviceDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  cameraEnabled?: boolean;
}
