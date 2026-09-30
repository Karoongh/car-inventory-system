import {
  IMarketPriceService,
  MarketPriceSample,
  PricePosition,
} from './market-price.types';

/**
 * Market Price Service
 * --------------------
 * Production: will call Divar search with strict rate-limiting, caching and polite delays.
 * Current: provides realistic mock averages so the UI and chart work immediately.
 *
 * IMPORTANT: Real scraping must respect Divar robots.txt / ToS and use:
 * - Redis cache (TTL 12–24h)
 * - Random delay 3–8s between requests
 * - Rotating User-Agent / optional proxy
 * - Circuit breaker on 429/403
 */
export class MarketPriceService implements IMarketPriceService {
  /** Simple in-memory cache for development */
  private cache = new Map<string, { data: MarketPriceSample; expiresAt: number }>();
  private readonly CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

  async getAverage(brand: string, model: string, year?: number): Promise<MarketPriceSample | null> {
    const key = this.cacheKey(brand, model, year);
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // --- MOCK DATA (replace with real Divar scraper later) ---
    const mock = this.generateMockAverage(brand, model, year);
    this.cache.set(key, { data: mock, expiresAt: Date.now() + this.CACHE_TTL_MS });
    return mock;
  }

  async calculatePosition(
    carPrice: number,
    brand: string,
    model: string,
    year?: number,
  ): Promise<PricePosition | null> {
    const market = await this.getAverage(brand, model, year);
    if (!market || market.averagePrice <= 0) return null;

    const ratio = carPrice / market.averagePrice;

    // Map ratio to color & label
    // < 0.85 → gray (خیلی زیر بازار)
    // 0.85–0.95 → green (قیمت خوب)
    // 0.95–1.05 → yellow (نزدیک میانگین)
    // 1.05–1.20 → orange (بالاتر از بازار)
    // > 1.20 → red (گران)
    let colorKey: PricePosition['colorKey'];
    let label: string;

    if (ratio < 0.85) {
      colorKey = 'gray';
      label = 'خیلی زیر میانگین بازار';
    } else if (ratio < 0.95) {
      colorKey = 'green';
      label = 'قیمت مناسب (زیر میانگین)';
    } else if (ratio <= 1.05) {
      colorKey = 'yellow';
      label = 'نزدیک به میانگین بازار';
    } else if (ratio <= 1.2) {
      colorKey = 'orange';
      label = 'بالاتر از میانگین بازار';
    } else {
      colorKey = 'red';
      label = 'گران‌تر از میانگین بازار';
    }

    return {
      ratio,
      label,
      colorKey,
      marketAverage: market.averagePrice,
      carPrice,
      sampleCount: market.sampleCount,
    };
  }

  private cacheKey(brand: string, model: string, year?: number): string {
    return `${brand.toLowerCase()}|${model.toLowerCase()}|${year ?? 'any'}`;
  }

  /** Generates plausible mock averages so the chart works without real scraping */
  private generateMockAverage(brand: string, model: string, year?: number): MarketPriceSample {
    // Very rough base prices (تومان) for common Iranian cars – for demo only
    const basePrices: Record<string, number> = {
      پژو: 650_000_000,
      سمند: 580_000_000,
      دنا: 820_000_000,
      رانا: 620_000_000,
      تارا: 950_000_000,
      شاهین: 780_000_000,
      کوییک: 480_000_000,
      ساینا: 450_000_000,
      تیبا: 380_000_000,
      پراید: 280_000_000,
      'رنو': 1_100_000_000,
      'هیوندای': 1_800_000_000,
      'کیا': 1_600_000_000,
    };

    let base = 700_000_000;
    for (const [key, val] of Object.entries(basePrices)) {
      if (brand.includes(key) || key.includes(brand)) {
        base = val;
        break;
      }
    }

    // Year adjustment (newer = more expensive)
    const currentYear = new Date().getFullYear();
    const y = year ?? currentYear - 3;
    const yearFactor = 1 + (y - (currentYear - 8)) * 0.04;

    const average = Math.round(base * Math.max(0.5, yearFactor));
    const sampleCount = 12 + Math.floor(Math.random() * 40);

    return {
      brand,
      model,
      year,
      averagePrice: average,
      sampleCount,
      minPrice: Math.round(average * 0.82),
      maxPrice: Math.round(average * 1.25),
      fetchedAt: new Date(),
      source: 'mock',
    };
  }
}
