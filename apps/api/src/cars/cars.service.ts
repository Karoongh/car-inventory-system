import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { randomUUID } from 'crypto';

export interface StoredCar {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  thirdPartyInsuranceDate: string | null;
  hasBodyInsurance: boolean;
  color: string;
  bodyConditionType: string;
  bodyPaintedParts: string[];
  bodyDescription: string | null;
  chassisConditionType: string;
  chassisImpactAreas: string[];
  chassisDescription: string | null;
  engineConditionType: string;
  engineDescription: string | null;
  gearboxConditionType: string;
  gearboxDescription: string | null;
  priceAmount: number;
  priceType: string;
  exchangeDetails: string | null;
  installmentDetails: string | null;
  ownerFullName: string;
  ownerMobile: string;
  isPhoneVisible: boolean;
  documentStatusType: string;
  documentProblemDesc: string | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class CarsService {
  private readonly cars = new Map<string, StoredCar>();

  create(dto: CreateCarDto, ownerId: string, imageFilenames: string[] = []): StoredCar {
    const now = new Date().toISOString();
    const car: StoredCar = {
      id: randomUUID(),
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
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.cars.set(car.id, car);
    return car;
  }

  findById(id: string): StoredCar | null {
    return this.cars.get(id) ?? null;
  }

  findByOwner(ownerId: string): StoredCar[] {
    return Array.from(this.cars.values()).filter((c) => c.ownerId === ownerId && c.isActive);
  }

  findAllActive(): StoredCar[] {
    return Array.from(this.cars.values())
      .filter((c) => c.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  findPublic(filters?: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): StoredCar[] {
    let list = Array.from(this.cars.values()).filter((c) => c.isActive);

    if (filters?.brand) {
      const q = filters.brand.toLowerCase();
      list = list.filter((c) => c.brand.toLowerCase().includes(q));
    }
    if (filters?.model) {
      const q = filters.model.toLowerCase();
      list = list.filter((c) => c.model.toLowerCase().includes(q));
    }
    if (filters?.yearFrom) list = list.filter((c) => c.year >= filters.yearFrom!);
    if (filters?.yearTo) list = list.filter((c) => c.year <= filters.yearTo!);
    if (filters?.minPrice) list = list.filter((c) => c.priceAmount >= filters.minPrice!);
    if (filters?.maxPrice) list = list.filter((c) => c.priceAmount <= filters.maxPrice!);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.trim.toLowerCase().includes(q) ||
          c.color.toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /** Smart suggestions based on similarity to a reference car or loose preferences */
  findSuggestions(options: {
    excludeId?: string;
    brand?: string;
    model?: string;
    year?: number;
    maxPrice?: number;
    limit?: number;
  }): StoredCar[] {
    const limit = options.limit ?? 6;
    let list = Array.from(this.cars.values()).filter((c) => c.isActive);

    if (options.excludeId) {
      list = list.filter((c) => c.id !== options.excludeId);
    }

    // Score each car
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

  updateVisibility(id: string, ownerId: string, isPhoneVisible: boolean): StoredCar {
    const car = this.cars.get(id);
    if (!car) throw new NotFoundException('خودرو یافت نشد');
    if (car.ownerId !== ownerId) throw new ForbiddenException('دسترسی غیرمجاز');

    car.isPhoneVisible = isPhoneVisible;
    car.updatedAt = new Date().toISOString();
    return car;
  }

  softDelete(id: string, ownerId: string): void {
    const car = this.cars.get(id);
    if (!car) throw new NotFoundException('خودرو یافت نشد');
    if (car.ownerId !== ownerId) throw new ForbiddenException('دسترسی غیرمجاز');

    car.isActive = false;
    car.updatedAt = new Date().toISOString();
  }

  /** Admin hard soft-delete without owner check */
  adminSoftDelete(id: string): void {
    const car = this.cars.get(id);
    if (!car) throw new NotFoundException('خودرو یافت نشد');
    car.isActive = false;
    car.updatedAt = new Date().toISOString();
  }
}
