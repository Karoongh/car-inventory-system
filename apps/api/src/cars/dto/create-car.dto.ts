import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  Min,
  Max,
  Matches,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BodyConditionTypeDto {
  ZERO_KM_DRY = 'ZERO_KM_DRY',
  NO_PAINT_NO_SCRATCH = 'NO_PAINT_NO_SCRATCH',
  NO_PAINT_MINOR_SCRATCH = 'NO_PAINT_MINOR_SCRATCH',
  ONE_PART_PAINTED = 'ONE_PART_PAINTED',
  TWO_PARTS_PAINTED = 'TWO_PARTS_PAINTED',
  THREE_PARTS_PAINTED = 'THREE_PARTS_PAINTED',
  FULL_PAINT = 'FULL_PAINT',
}

export enum ChassisConditionTypeDto {
  HEALTHY_AND_SEALED = 'HEALTHY_AND_SEALED',
  IMPACTED = 'IMPACTED',
}

export enum EngineConditionTypeDto {
  HEALTHY_AND_SEALED = 'HEALTHY_AND_SEALED',
  RECENTLY_REPAIRED = 'RECENTLY_REPAIRED',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
}

export enum GearboxConditionTypeDto {
  HEALTHY_AND_SEALED = 'HEALTHY_AND_SEALED',
  RECENTLY_REPAIRED = 'RECENTLY_REPAIRED',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
}

export enum PriceOfferTypeDto {
  CASH_ONLY = 'CASH_ONLY',
  EXCHANGEABLE = 'EXCHANGEABLE',
  INSTALLMENT = 'INSTALLMENT',
}

export enum DocumentStatusTypeDto {
  COMPLETE_AND_READY = 'COMPLETE_AND_READY',
  HAS_PROBLEM = 'HAS_PROBLEM',
}

export class CreateCarDto {
  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsString()
  trim!: string;

  @IsInt()
  @Min(1370)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsOptional()
  @IsString()
  thirdPartyInsuranceDate?: string; // ISO date

  @IsBoolean()
  hasBodyInsurance!: boolean;

  @IsString()
  color!: string;

  // Body
  @IsEnum(BodyConditionTypeDto)
  bodyConditionType!: BodyConditionTypeDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bodyPaintedParts?: string[];

  @IsOptional()
  @IsString()
  bodyDescription?: string;

  // Chassis
  @IsEnum(ChassisConditionTypeDto)
  chassisConditionType!: ChassisConditionTypeDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chassisImpactAreas?: string[];

  @IsOptional()
  @IsString()
  chassisDescription?: string;

  // Engine
  @IsEnum(EngineConditionTypeDto)
  engineConditionType!: EngineConditionTypeDto;

  @IsOptional()
  @IsString()
  engineDescription?: string;

  // Gearbox
  @IsEnum(GearboxConditionTypeDto)
  gearboxConditionType!: GearboxConditionTypeDto;

  @IsOptional()
  @IsString()
  gearboxDescription?: string;

  // Price
  @IsNumber()
  @Min(1)
  priceAmount!: number;

  @IsEnum(PriceOfferTypeDto)
  priceType!: PriceOfferTypeDto;

  @IsOptional()
  @IsString()
  exchangeDetails?: string;

  @IsOptional()
  @IsString()
  installmentDetails?: string;

  // Owner (can be overridden by authenticated user)
  @IsString()
  ownerFullName!: string;

  @IsString()
  @Matches(/^09\d{9}$/)
  ownerMobile!: string;

  @IsBoolean()
  isPhoneVisible!: boolean;

  // Documents
  @IsEnum(DocumentStatusTypeDto)
  documentStatusType!: DocumentStatusTypeDto;

  @IsOptional()
  @IsString()
  documentProblemDesc?: string;
}
