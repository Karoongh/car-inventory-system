export interface MarketPriceSample {
  brand: string;
  model: string;
  year?: number;
  averagePrice: number;
  sampleCount: number;
  minPrice?: number;
  maxPrice?: number;
  fetchedAt: Date;
  source: 'divar' | 'mock' | 'manual';
}

export interface PricePosition {
  /** 0 = significantly below market, 0.5 = at market, 1 = significantly above market */
  ratio: number;
  /** Human label */
  label: string;
  /** Color key for UI */
  colorKey: 'gray' | 'green' | 'yellow' | 'orange' | 'red';
  marketAverage: number;
  carPrice: number;
  sampleCount: number;
}

export interface IMarketPriceService {
  getAverage(brand: string, model: string, year?: number): Promise<MarketPriceSample | null>;
  calculatePosition(carPrice: number, brand: string, model: string, year?: number): Promise<PricePosition | null>;
}
