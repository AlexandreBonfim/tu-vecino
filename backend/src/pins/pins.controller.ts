import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinsService } from './pins.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/jwt.types';

@ApiTags('pins')
@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  // Authenticated: only users who've registered can submit reports.
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePinDto, @CurrentUser() user: RequestUser) {
    return this.pinsService.create(dto, user.userId);
  }

  // Public: map is browsable before signup (lower onboarding friction).
  @Get()
  findNearby(@Query() query: FindNearbyDto) {
    return this.pinsService.findNearby(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pinsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.pinsService.confirm(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/dispute')
  dispute(@Param('id') id: string) {
    return this.pinsService.dispute(id);
  }
}
