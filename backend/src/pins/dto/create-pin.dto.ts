import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PinCategory } from 'generated/prisma/enums';

// Note what's deliberately absent: no free-text description field.
// Zero-text-input is a core product constraint — category + location
// + optional intensity tap + optional photo is the entire submission.
export class CreatePinDto {
  @IsEnum(PinCategory)
  category: PinCategory;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsOptional()
  @Min(1)
  @Max(3)
  intensity?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
