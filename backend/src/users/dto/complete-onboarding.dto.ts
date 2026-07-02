import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Language } from 'generated/prisma/enums';

export class CompleteOnboardingDto {
  @IsEnum(Language)
  preferredLanguage: Language;

  @IsLatitude()
  homeLat: number;

  @IsLongitude()
  homeLng: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;
}
