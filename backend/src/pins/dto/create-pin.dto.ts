import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PinCategory } from 'generated/prisma/enums';

// Note what's deliberately absent: no free-text description field.
// Zero-text-input is a core product constraint — category + location
// + optional intensity tap + optional photo is the entire submission.
export class CreatePinDto {
  @ApiProperty({ enum: PinCategory, example: 'TRAFFIC' })
  @IsEnum(PinCategory)
  category: PinCategory;

  @ApiProperty({ example: 40.4168 })
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: -3.7038 })
  @IsLongitude()
  lng: number;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 3 })
  @IsOptional()
  @Min(1)
  @Max(3)
  intensity?: number;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
