import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
