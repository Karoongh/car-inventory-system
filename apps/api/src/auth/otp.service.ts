import { Injectable, BadRequestException, TooManyRequestsException } from '@nestjs/common';
import { randomInt } from 'crypto';

/**
 * OTP Service – stores codes in memory for development.
 * In production this will be replaced by Redis (Task later).
 * Rate limiting is enforced here.
 */
@Injectable()
export class OtpService {
  private readonly store = new Map<string, { code: string; expiresAt: number; attempts: number }>();
  private readonly rateLimit = new Map<string, { count: number; resetAt: number }>();

  private readonly OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ATTEMPTS = 5;
  private readonly RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
  private readonly RATE_LIMIT_MAX = 5; // max 5 OTP requests per window

  async requestOtp(mobile: string): Promise<{ message: string }> {
    this.checkRateLimit(mobile);

    const code = this.generateCode();
    const expiresAt = Date.now() + this.OTP_TTL_MS;

    this.store.set(mobile, { code, expiresAt, attempts: 0 });

    // TODO: integrate real SMS provider (SMS.ir / Kavenegar / etc.)
    // For now we log the code (development only)
    console.log(`[OTP] mobile=${mobile} code=${code}`);

    return { message: 'کد تایید ارسال شد' };
  }

  async verifyOtp(mobile: string, code: string): Promise<boolean> {
    const record = this.store.get(mobile);

    if (!record) {
      throw new BadRequestException('کد تایید یافت نشد یا منقضی شده است');
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(mobile);
      throw new BadRequestException('کد تایید منقضی شده است');
    }

    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.store.delete(mobile);
      throw new TooManyRequestsException('تعداد تلاش‌ها بیش از حد مجاز است');
    }

    record.attempts += 1;

    if (record.code !== code) {
      throw new BadRequestException('کد تایید اشتباه است');
    }

    // success – remove code
    this.store.delete(mobile);
    return true;
  }

  private generateCode(): string {
    return randomInt(10000, 99999).toString(); // 5-digit
  }

  private checkRateLimit(mobile: string): void {
    const now = Date.now();
    const entry = this.rateLimit.get(mobile);

    if (!entry || now > entry.resetAt) {
      this.rateLimit.set(mobile, { count: 1, resetAt: now + this.RATE_LIMIT_WINDOW_MS });
      return;
    }

    if (entry.count >= this.RATE_LIMIT_MAX) {
      throw new TooManyRequestsException('تعداد درخواست‌های کد تایید بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید');
    }

    entry.count += 1;
  }
}
