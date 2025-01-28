import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LogFailedAttemptDto {
  @IsString()
  @IsNotEmpty()
  attemptType: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
