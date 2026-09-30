/**
 * Daily Market Price Update Job (skeleton)
 * ----------------------------------------
 * This script will later:
 * 1. Query all distinct brand+model+year combinations from active cars
 * 2. Call MarketPriceService (which will hit Divar with rate limits)
 * 3. Store results in MarketPriceHistory table
 *
 * For now it only logs the plan.
 *
 * Run with: npx ts-node scripts/daily-price-update.ts
 * Or schedule via cron / BullMQ in production.
 */

console.log('[daily-price-update] Job started at', new Date().toISOString());
console.log('[daily-price-update] In production this will:');
console.log('  1. Fetch distinct brand/model/year from cars');
console.log('  2. Call Divar search with polite delays + cache');
console.log('  3. Upsert into market_price_history');
console.log('[daily-price-update] Currently using mock averages inside MarketPriceService.');
console.log('[daily-price-update] Job finished.');
