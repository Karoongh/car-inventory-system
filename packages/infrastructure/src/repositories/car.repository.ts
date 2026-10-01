import {
  PrismaClient,
  Car as PrismaCar,
  BodyConditionType,
  ChassisConditionType,
  EngineConditionType,
  GearboxConditionType,
  PriceOfferType,
  DocumentStatusType,
  Prisma,
} from '@prisma/client';
import { prisma } from '../prisma/prisma.service';

export interface CreateCarInput {
  ownerId: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  thirdPartyInsuranceDate?: string | null;
  hasBodyInsurance: boolean;
  color: string;
  bodyConditionType: string;
  bodyPaintedParts?: string[];
  bodyDescription?: string | null;
  chassisConditionType: string;
  chassisImpactAreas?: string[];
  chassisDescription?: string | null;
  engineConditionType: string;
  engineDescription?: string | null;
  gearboxConditionType: string;
  gearboxDescription?: string | null;
  priceAmount: number;
  priceType: string;
  exchangeDetails?: string | null;
  installmentDetails?: string | null;
  ownerFullName: string;
  ownerMobile: string;
  isPhoneVisible: boolean;
  documentStatusType: string;
  documentProblemDesc?: string | null;
  images?: string[];
}

export interface CarRecord {
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

export interface CarFilter {
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  ownerId?: string;
  isActive?: boolean;
}

function mapCar(c: PrismaCar): CarRecord {
  return {
    id: c.id,
    ownerId: c.ownerId,
    brand: c.brand,
    model: c.model,
    trim: c.trim,
    year: c.year,
    thirdPartyInsuranceDate: c.thirdPartyInsuranceDate
      ? c.thirdPartyInsuranceDate.toISOString()
      : null,
    hasBodyInsurance: c.hasBodyInsurance,
    color: c.color,
    bodyConditionType: c.bodyConditionType,
    bodyPaintedParts: c.bodyPaintedParts,
    bodyDescription: c.bodyDescription,
    chassisConditionType: c.chassisConditionType,
    chassisImpactAreas: c.chassisImpactAreas,
    chassisDescription: c.chassisDescription,
    engineConditionType: c.engineConditionType,
    engineDescription: c.engineDescription,
    gearboxConditionType: c.gearboxConditionType,
    gearboxDescription: c.gearboxDescription,
    priceAmount: Number(c.priceAmount),
    priceType: c.priceType,
    exchangeDetails: c.exchangeDetails,
    installmentDetails: c.installmentDetails,
    ownerFullName: c.ownerFullName,
    ownerMobile: c.ownerMobile,
    isPhoneVisible: c.isPhoneVisible,
    documentStatusType: c.documentStatusType,
    documentProblemDesc: c.documentProblemDesc,
    images: c.images,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export class PrismaCarRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async create(input: CreateCarInput): Promise<CarRecord> {
    const car = await this.db.car.create({
      data: {
        ownerId: input.ownerId,
        brand: input.brand,
        model: input.model,
        trim: input.trim,
        year: input.year,
        thirdPartyInsuranceDate: input.thirdPartyInsuranceDate
          ? new Date(input.thirdPartyInsuranceDate)
          : null,
        hasBodyInsurance: input.hasBodyInsurance,
        color: input.color,
        bodyConditionType: input.bodyConditionType as BodyConditionType,
        bodyPaintedParts: input.bodyPaintedParts ?? [],
        bodyDescription: input.bodyDescription ?? null,
        chassisConditionType: input.chassisConditionType as ChassisConditionType,
        chassisImpactAreas: input.chassisImpactAreas ?? [],
        chassisDescription: input.chassisDescription ?? null,
        engineConditionType: input.engineConditionType as EngineConditionType,
        engineDescription: input.engineDescription ?? null,
        gearboxConditionType: input.gearboxConditionType as GearboxConditionType,
        gearboxDescription: input.gearboxDescription ?? null,
        priceAmount: BigInt(input.priceAmount),
        priceType: input.priceType as PriceOfferType,
        exchangeDetails: input.exchangeDetails ?? null,
        installmentDetails: input.installmentDetails ?? null,
        ownerFullName: input.ownerFullName,
        ownerMobile: input.ownerMobile,
        isPhoneVisible: input.isPhoneVisible,
        documentStatusType: input.documentStatusType as DocumentStatusType,
        documentProblemDesc: input.documentProblemDesc ?? null,
        images: input.images ?? [],
      },
    });
    return mapCar(car);
  }

  async findById(id: string): Promise<CarRecord | null> {
    const car = await this.db.car.findUnique({ where: { id } });
    return car ? mapCar(car) : null;
  }

  async findMany(filter: CarFilter = {}): Promise<CarRecord[]> {
    const where: Prisma.CarWhereInput = {
      isActive: filter.isActive ?? true,
    };

    if (filter.ownerId) where.ownerId = filter.ownerId;
    if (filter.brand) where.brand = { contains: filter.brand, mode: 'insensitive' };
    if (filter.model) where.model = { contains: filter.model, mode: 'insensitive' };
    if (filter.yearFrom || filter.yearTo) {
      where.year = {};
      if (filter.yearFrom) where.year.gte = filter.yearFrom;
      if (filter.yearTo) where.year.lte = filter.yearTo;
    }
    if (filter.minPrice || filter.maxPrice) {
      where.priceAmount = {};
      if (filter.minPrice) where.priceAmount.gte = BigInt(filter.minPrice);
      if (filter.maxPrice) where.priceAmount.lte = BigInt(filter.maxPrice);
    }
    if (filter.search) {
      where.OR = [
        { brand: { contains: filter.search, mode: 'insensitive' } },
        { model: { contains: filter.search, mode: 'insensitive' } },
        { trim: { contains: filter.search, mode: 'insensitive' } },
        { color: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const cars = await this.db.car.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return cars.map(mapCar);
  }

  async updateVisibility(id: string, ownerId: string, isPhoneVisible: boolean): Promise<CarRecord> {
    const existing = await this.db.car.findFirst({ where: { id, ownerId } });
    if (!existing) throw new Error('خودرو یافت نشد یا دسترسی ندارید');

    const car = await this.db.car.update({
      where: { id },
      data: { isPhoneVisible },
    });
    return mapCar(car);
  }

  async softDelete(id: string, ownerId?: string): Promise<void> {
    const where: Prisma.CarWhereInput = { id };
    if (ownerId) where.ownerId = ownerId;

    const existing = await this.db.car.findFirst({ where });
    if (!existing) throw new Error('خودرو یافت نشد یا دسترسی ندارید');

    await this.db.car.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
