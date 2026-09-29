// Domain layer – public API

// Value Objects
export * from './value-objects/body-condition';
export * from './value-objects/chassis-condition';
export * from './value-objects/engine-condition';
export * from './value-objects/gearbox-condition';
export * from './value-objects/price-offer';
export * from './value-objects/document-status';
export * from './value-objects/owner-contact';

// Entities
export * from './entities/car.entity';
export * from './entities/user.entity';

// Repository Interfaces
export * from './repositories/car.repository';
export * from './repositories/user.repository';
