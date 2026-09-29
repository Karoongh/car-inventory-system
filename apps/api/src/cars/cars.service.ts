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
  images: string[]; // filenames of medium size for now
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * In-memory Car store for Task 4.
 * Will be replaced by Prisma repository in later tasks.
 */
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

  findPublic(filters?: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    minPrice?: number;
    maxPrice?: number;
  }): StoredCar[] {
    let list = Array.from(this.cars.values()).filter((c) => c.isActive);

    if (filters?.brand) list = list.filter((c) => c.brand.includes(filters.brand!));
    if (filters?.model) list = list.filter((c) => c.model.includes(filters.model!));
    if (filters?.yearFrom) list = list.filter((c) => c.year >= filters.yearFrom!);
    if (filters?.yearTo) list = list.filter((c) => c.year <= filters.yearTo!);
    if (filters?.minPrice) list = list.filter((c) => c.priceAmount >= filters.minPrice!);
    if (filters?.maxPrice) list = list.filter((c) => c.priceAmount <= filters.maxPrice!);

    return list;
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
}
