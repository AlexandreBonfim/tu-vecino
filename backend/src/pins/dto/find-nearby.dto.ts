import { PinCategory } from 'generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindNearbyDto {
  @ApiProperty({ example: 40.4168 })
  @IsLatitude()
  @Type(() => Number)
  lat: number;

  @ApiProperty({ example: -3.7038 })
  @IsLongitude()
  @Type(() => Number)
  lng: number;

  // Radius in metres. Default covers a typical neighbourhood-level map view.
  @ApiPropertyOptional({ example: 3000, default: 3000 })
  @IsOptional()
  @Type(() => Number)
  @Min(100)
  @Max(50_000)
  radiusMeters?: number = 3000;

  @ApiPropertyOptional({ enum: PinCategory, example: 'TRAFFIC' })
  @IsOptional()
  @IsEnum(PinCategory)
  category?: PinCategory;
}
