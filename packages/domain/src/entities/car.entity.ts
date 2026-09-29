import { BodyCondition } from '../value-objects/body-condition';
import { ChassisCondition } from '../value-objects/chassis-condition';
import { EngineCondition } from '../value-objects/engine-condition';
import { GearboxCondition } from '../value-objects/gearbox-condition';
import { PriceOffer } from '../value-objects/price-offer';
import { DocumentStatus } from '../value-objects/document-status';
import { OwnerContact } from '../value-objects/owner-contact';

export interface CarProps {
  id?: string;
  brand: string;
  model: string;
  trim: string;                     // تیپ (مثلاً تالیسمان E3)
  year: number;                     // سال ساخت
  thirdPartyInsuranceDate?: Date | null;
  hasBodyInsurance: boolean;
  color: string;
  bodyCondition: BodyCondition;
  chassisCondition: ChassisCondition;
  engineCondition: EngineCondition;
  gearboxCondition: GearboxCondition;
  priceOffer: PriceOffer;
  owner: OwnerContact;
  documentStatus: DocumentStatus;
  images: string[];                 // مسیر فایل‌های WebP
  isActive: boolean;                // مالک می‌تواند حذف نرم کند
  ownerId: string;                  // شناسه کاربر مالک
  createdAt?: Date;
  updatedAt?: Date;
}

export class Car {
  readonly id?: string;
  readonly brand: string;
  readonly model: string;
  readonly trim: string;
  readonly year: number;
  readonly thirdPartyInsuranceDate: Date | null;
  readonly hasBodyInsurance: boolean;
  readonly color: string;
  readonly bodyCondition: BodyCondition;
  readonly chassisCondition: ChassisCondition;
  readonly engineCondition: EngineCondition;
  readonly gearboxCondition: GearboxCondition;
  readonly priceOffer: PriceOffer;
  readonly owner: OwnerContact;
  readonly documentStatus: DocumentStatus;
  readonly images: readonly string[];
  readonly isActive: boolean;
  readonly ownerId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CarProps) {
    this.id = props.id;
    this.brand = props.brand;
    this.model = props.model;
    this.trim = props.trim;
    this.year = props.year;
    this.thirdPartyInsuranceDate = props.thirdPartyInsuranceDate ?? null;
    this.hasBodyInsurance = props.hasBodyInsurance;
    this.color = props.color;
    this.bodyCondition = props.bodyCondition;
    this.chassisCondition = props.chassisCondition;
    this.engineCondition = props.engineCondition;
    this.gearboxCondition = props.gearboxCondition;
    this.priceOffer = props.priceOffer;
    this.owner = props.owner;
    this.documentStatus = props.documentStatus;
    this.images = Object.freeze([...(props.images ?? [])]);
    this.isActive = props.isActive ?? true;
    this.ownerId = props.ownerId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: CarProps): Car {
    if (!props.brand || !props.model || !props.trim) {
      throw new Error('برند، مدل و تیپ الزامی هستند');
    }
    if (props.year < 1370 || props.year > new Date().getFullYear() + 1) {
      throw new Error('سال ساخت نامعتبر است');
    }
    return new Car(props);
  }

  deactivate(): Car {
    return new Car({ ...this.toProps(), isActive: false });
  }

  updateOwnerVisibility(isVisible: boolean): Car {
    const newOwner = isVisible ? this.owner.showPhone() : this.owner.hidePhone();
    return new Car({ ...this.toProps(), owner: newOwner });
  }

  private toProps(): CarProps {
    return {
      id: this.id,
      brand: this.brand,
      model: this.model,
      trim: this.trim,
      year: this.year,
      thirdPartyInsuranceDate: this.thirdPartyInsuranceDate,
      hasBodyInsurance: this.hasBodyInsurance,
      color: this.color,
      bodyCondition: this.bodyCondition,
      chassisCondition: this.chassisCondition,
      engineCondition: this.engineCondition,
      gearboxCondition: this.gearboxCondition,
      priceOffer: this.priceOffer,
      owner: this.owner,
      documentStatus: this.documentStatus,
      images: [...this.images],
      isActive: this.isActive,
      ownerId: this.ownerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
