import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from 'generated/prisma/enums';

export class CompleteOnboardingDto {
  @ApiProperty({ enum: Language, example: 'es' })
  @IsEnum(Language)
  preferredLanguage: Language;

  @ApiProperty({ example: 40.4168 })
  @IsLatitude()
  homeLat: number;

  @ApiProperty({ example: -3.7038 })
  @IsLongitude()
  homeLng: number;

  @ApiPropertyOptional({ example: 'Alex' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;
}
