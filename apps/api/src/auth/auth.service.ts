import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { AuthResponse, AuthUser } from '@car-inventory/shared';
import { PrismaUserRepository } from '@car-inventory/infrastructure';

@Injectable()
export class AuthService {
  private readonly userRepo = new PrismaUserRepository();

  constructor(
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(mobile: string) {
    return this.otpService.requestOtp(mobile);
  }

  async verifyOtpAndLogin(mobile: string, code: string): Promise<AuthResponse> {
    await this.otpService.verifyOtp(mobile, code);

    let user = await this.userRepo.findByMobile(mobile);

    if (!user) {
      // Auto-register as Owner
      user = await this.userRepo.create({
        mobile,
        role: 'Owner',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('حساب کاربری غیرفعال است');
    }

    const payload = { sub: user.id, mobile: user.mobile, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const authUser: AuthUser = {
      id: user.id,
      mobile: user.mobile,
      fullName: user.fullName,
      role: user.role,
    };

    return {
      user: authUser,
      tokens: {
        accessToken,
        expiresIn: '7d',
      },
    };
  }

  async validateUser(userId: string): Promise<AuthUser | null> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      mobile: user.mobile,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
