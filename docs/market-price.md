# Market Price & Chart (Task 6)

## Goal

Show sellers and buyers where a car’s asking price sits relative to the current market average (inspired by Divar listings).

## Color Scale (right → left in RTL)

| Ratio vs Average | Color  | Label                     |
|------------------|--------|---------------------------|
| < 0.85           | Gray   | خیلی زیر میانگین بازار   |
| 0.85 – 0.95      | Green  | قیمت مناسب (زیر میانگین)  |
| 0.95 – 1.05      | Yellow | نزدیک به میانگین بازار    |
| 1.05 – 1.20      | Orange | بالاتر از میانگین بازار   |
| > 1.20           | Red    | گران‌تر از میانگین بازار  |

## Architecture

- `MarketPriceService` (packages/infrastructure/src/price)
  - Currently returns realistic **mock** averages so the UI works immediately
  - Designed to be swapped with a real Divar scraper later
  - Built-in in-memory cache (12 h TTL)
- Endpoint: `GET /api/v1/cars/:id/price-position`
- UI component: `PricePositionChart` (mobile-first gauge)

## Real Divar Integration (future)

Must implement:
- Redis cache
- Random 3–8 s delay between requests
- Respect robots.txt / rate limits
- Circuit breaker on 429/403
- Store history in `MarketPriceHistory` table
- Daily BullMQ / cron job (`scripts/daily-price-update.ts`)

## Disclaimer

Mock data is for demonstration only. Real market prices require a compliant data source.
