import { IsDate, IsOptional, IsString } from 'class-validator';

export class AppendActivityLogDto {
  @IsString()
  type: string;

  @IsDate()
  timestamp: Date;

  @IsOptional()
  detections?: Array<{
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;

  @IsOptional()
  details?: {
    error?: string;
    type?: string;
  };
}
