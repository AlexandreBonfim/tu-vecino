import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PIN_EXPIRY_MINUTES } from '../common/pin-expiry';
import type { CreatePinDto } from './dto/create-pin.dto';
import type { FindNearbyDto } from './dto/find-nearby.dto';

@Injectable()
export class PinsService {
  constructor(private readonly prisma: PrismaService) {}

  // Prisma can't express the PostGIS geography column in its fluent API,
  // so we insert via $queryRaw and return the created row.
  async create(dto: CreatePinDto, authorId: string) {
    const expiresAt = new Date(
      Date.now() + PIN_EXPIRY_MINUTES[dto.category] * 60 * 1000,
    );

    // ST_MakePoint(lng, lat) — note the order: longitude first.
    const rows = await this.prisma.client.$queryRaw<{ id: string }[]>`
      INSERT INTO pins (
        category, lat, lng, location,
        intensity, "photoUrl", "authorId", "expiresAt"
      ) VALUES (
        ${dto.category}::"PinCategory",
        ${dto.lat},
        ${dto.lng},
        ST_SetSRID(ST_MakePoint(${dto.lng}, ${dto.lat}), 4326)::geography,
        ${dto.intensity ?? 1},
        ${dto.photoUrl ?? null},
        ${authorId}::uuid,
        ${expiresAt}
      )
      RETURNING id
    `;

    return this.findOne(rows[0].id);
  }

  // Public map query — active pins within radiusMeters using the GIST index.
  findNearby(query: FindNearbyDto) {
    const { lat, lng, radiusMeters = 3000, category } = query;

    type PinRow = {
      id: string;
      category: string;
      lat: number;
      lng: number;
      intensity: number;
      source: string;
      photoUrl: string | null;
      confirmCount: number;
      disputeCount: number;
      expiresAt: Date;
      createdAt: Date;
      authorId: string | null;
    };

    if (category) {
      return this.prisma.client.$queryRaw<PinRow[]>`
        SELECT id, category, lat, lng, intensity, source,
               "photoUrl", "confirmCount", "disputeCount",
               "expiresAt", "createdAt", "authorId"
        FROM   pins
        WHERE  "isActive" = true
          AND  "expiresAt" > now()
          AND  category = ${category}::"PinCategory"
          AND  ST_DWithin(
                 location,
                 ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
                 ${radiusMeters}
               )
        ORDER  BY "createdAt" DESC
      `;
    }

    return this.prisma.client.$queryRaw<PinRow[]>`
      SELECT id, category, lat, lng, intensity, source,
             "photoUrl", "confirmCount", "disputeCount",
             "expiresAt", "createdAt", "authorId"
      FROM   pins
      WHERE  "isActive" = true
        AND  "expiresAt" > now()
        AND  ST_DWithin(
               location,
               ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
               ${radiusMeters}
             )
      ORDER  BY "createdAt" DESC
    `;
  }

  async findOne(id: string) {
    const pin = await this.prisma.pin.findUnique({ where: { id } });

    if (!pin) throw new NotFoundException('Pin not found');

    return pin;
  }

  // TODO: comfirm and dispute should keep track of author?
  // "Still there" — boosts pin credibility.
  async confirm(id: string) {
    await this.findOne(id);

    return this.prisma.pin.update({
      where: { id },
      data: { confirmCount: { increment: 1 } },
    });
  }

  // "Not here" — enough disputes auto-expire the pin early.
  async dispute(id: string) {
    await this.findOne(id);

    const updated = await this.prisma.pin.update({
      where: { id },
      data: { disputeCount: { increment: 1 } },
    });

    // Simple MVP rule: 3+ disputes and disputes > 2× confirms → deactivate.
    // Full moderation model is Phase 2.
    if (
      updated.disputeCount >= 3 &&
      updated.disputeCount > updated.confirmCount * 2
    ) {
      return this.prisma.pin.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return updated;
  }

  // Called by a scheduled job. Marks expired pins inactive at the DB level.
  async expireStale() {
    const result = await this.prisma.pin.updateMany({
      where: { isActive: true, expiresAt: { lte: new Date() } },
      data: { isActive: false },
    });
    return result.count;
  }
}
