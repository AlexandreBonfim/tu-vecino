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

export class FindNearbyDto {
  @IsLatitude()
  @Type(() => Number)
  lat: number;

  @IsLongitude()
  @Type(() => Number)
  lng: number;

  // Radius in metres. Default covers a typical neighbourhood-level map view.
  @IsOptional()
  @Type(() => Number)
  @Min(100)
  @Max(50_000)
  radiusMeters?: number = 3000;

  @IsOptional()
  @IsEnum(PinCategory)
  category?: PinCategory;
}
