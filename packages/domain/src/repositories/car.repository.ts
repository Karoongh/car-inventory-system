import { Car } from '../entities/car.entity';

export interface CarFilter {
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  bodyConditionType?: string;
  isActive?: boolean;
  ownerId?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICarRepository {
  create(car: Car): Promise<Car>;
  update(car: Car): Promise<Car>;
  findById(id: string): Promise<Car | null>;
  findMany(filter: CarFilter, pagination: PaginationOptions): Promise<PaginatedResult<Car>>;
  softDelete(id: string, ownerId: string): Promise<void>;
  count(filter?: CarFilter): Promise<number>;
}
