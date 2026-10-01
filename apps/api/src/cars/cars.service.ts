import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { PrismaCarRepository, CarRecord } from '@car-inventory/infrastructure';

@Injectable()
export class CarsService {
  private readonly carRepo = new PrismaCarRepository();

  async create(dto: CreateCarDto, ownerId: string, imageFilenames: string[] = []): Promise<CarRecord> {
    return this.carRepo.create({
      ownerId,
      brand: dto.brand,
      model: dto.model,
      trim: dto.trim,
      year: dto.year,
      thirdPartyInsuranceDate: dto.thirdPartyInsuranceDate ?? null,
      hasBodyInsurance: dto.hasBodyInsurance,
      color: dto.color,
      bodyConditionType: dto.bodyConditionType,
      bodyPaintedParts: dto.bodyPaintedParts ?? [],
      bodyDescription: dto.bodyDescription ?? null,
      chassisConditionType: dto.chassisConditionType,
      chassisImpactAreas: dto.chassisImpactAreas ?? [],
      chassisDescription: dto.chassisDescription ?? null,
      engineConditionType: dto.engineConditionType,
      engineDescription: dto.engineDescription ?? null,
      gearboxConditionType: dto.gearboxConditionType,
      gearboxDescription: dto.gearboxDescription ?? null,
      priceAmount: dto.priceAmount,
      priceType: dto.priceType,
      exchangeDetails: dto.exchangeDetails ?? null,
      installmentDetails: dto.installmentDetails ?? null,
      ownerFullName: dto.ownerFullName,
      ownerMobile: dto.ownerMobile,
      isPhoneVisible: dto.isPhoneVisible,
      documentStatusType: dto.documentStatusType,
      documentProblemDesc: dto.documentProblemDesc ?? null,
      images: imageFilenames,
    });
  }

  async findById(id: string): Promise<CarRecord | null> {
    return this.carRepo.findById(id);
  }

  async findByOwner(ownerId: string): Promise<CarRecord[]> {
    return this.carRepo.findMany({ ownerId, isActive: true });
  }

  async findAllActive(): Promise<CarRecord[]> {
    return this.carRepo.findMany({ isActive: true });
  }

  async findPublic(filters?: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<CarRecord[]> {
    return this.carRepo.findMany({
      ...filters,
      isActive: true,
    });
  }

  async findSuggestions(options: {
    excludeId?: string;
    brand?: string;
    model?: string;
    year?: number;
    maxPrice?: number;
    limit?: number;
  }): Promise<CarRecord[]> {
    const limit = options.limit ?? 6;
    let list = await this.carRepo.findMany({ isActive: true });

    if (options.excludeId) {
      list = list.filter((c) => c.id !== options.excludeId);
    }

    const scored = list.map((car) => {
      let score = 0;
      if (options.brand && car.brand.toLowerCase().includes(options.brand.toLowerCase())) score += 40;
      if (options.model && car.model.toLowerCase().includes(options.model.toLowerCase())) score += 30;
      if (options.year) {
        const yearDiff = Math.abs(car.year - options.year);
        if (yearDiff === 0) score += 20;
        else if (yearDiff <= 2) score += 12;
        else if (yearDiff <= 4) score += 5;
      }
      if (options.maxPrice && car.priceAmount <= options.maxPrice * 1.15) score += 15;
      if (car.bodyConditionType === 'ZERO_KM_DRY' || car.bodyConditionType === 'NO_PAINT_NO_SCRATCH') score += 5;
      return { car, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.car);
  }

  async updateVisibility(id: string, ownerId: string, isPhoneVisible: boolean): Promise<CarRecord> {
    try {
      return await this.carRepo.updateVisibility(id, ownerId, isPhoneVisible);
    } catch {
      throw new ForbiddenException('دسترسی غیرمجاز یا خودرو یافت نشد');
    }
  }

  async softDelete(id: string, ownerId: string): Promise<void> {
    try {
      await this.carRepo.softDelete(id, ownerId);
    } catch {
      throw new ForbiddenException('دسترسی غیرمجاز یا خودرو یافت نشد');
    }
  }

  async adminSoftDelete(id: string): Promise<void> {
    try {
      await this.carRepo.softDelete(id);
    } catch {
      throw new NotFoundException('خودرو یافت نشد');
    }
  }
}
