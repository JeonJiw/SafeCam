import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ActivityLogDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsOptional()
  @IsArray()
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
  verification?: {
    success: boolean;
  };
}
