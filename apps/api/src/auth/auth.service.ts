import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { AuthResponse, AuthUser } from '@car-inventory/shared';

/**
 * Temporary in-memory user store for Task 3.
 * Will be replaced by Prisma UserRepository in later tasks.
 */
@Injectable()
export class AuthService {
  private readonly users = new Map<string, AuthUser>();

  constructor(
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(mobile: string) {
    return this.otpService.requestOtp(mobile);
  }

  async verifyOtpAndLogin(mobile: string, code: string): Promise<AuthResponse> {
    await this.otpService.verifyOtp(mobile, code);

    let user = this.users.get(mobile);

    if (!user) {
      // auto-register as Owner
      user = {
        id: `user_${Date.now()}`,
        mobile,
        fullName: null,
        role: 'Owner',
      };
      this.users.set(mobile, user);
    }

    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user,
      tokens: {
        accessToken,
        expiresIn: '7d',
      },
    };
  }

  async validateUser(userId: string): Promise<AuthUser | null> {
    for (const user of this.users.values()) {
      if (user.id === userId) return user;
    }
    return null;
  }
}
