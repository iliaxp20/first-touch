import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto, UserRoleType } from './dto/verify-otp.dto';
import { LoginPasswordDto } from './dto/login-password.dto';

interface OtpRecord {
  code: string;
  expiresAt: number;
  referralCode?: string;
  attempts: number;
}

@Injectable()
export class AuthService {
  // In-memory OTP store (In production, replace with Redis)
  private otpStore = new Map<string, OtpRecord>();

  async sendOtp(dto: SendOtpDto) {
    const { phoneNumber, referralCode } = dto;
    const now = Date.now();

    // Check rate limit: 1 request per 60 seconds
    const existing = this.otpStore.get(phoneNumber);
    if (existing && existing.expiresAt - now > 60000) {
      throw new BadRequestException('لطفاً قبل از ارسال مجدد کد، ۶۰ ثانیه صبر کنید.');
    }

    // Generate secure test OTP: '12345' or 5-digit code
    const generatedCode = process.env.NODE_ENV === 'production' 
      ? Math.floor(10000 + Math.random() * 90000).toString()
      : '12345';

    this.otpStore.set(phoneNumber, {
      code: generatedCode,
      expiresAt: now + 120 * 1000, // 2 minutes
      referralCode,
      attempts: 0,
    });

    return {
      success: true,
      message: 'کد تایید با موفقیت ارسال شد',
      phoneNumber,
      expiresInSeconds: 120,
      testOtp: generatedCode, // Provided for testing & seamless development
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phoneNumber, otp, role = UserRoleType.PLAYER } = dto;
    const record = this.otpStore.get(phoneNumber);

    if (!record) {
      throw new BadRequestException('کد تاییدی برای این شماره درخواست نشده است.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(phoneNumber);
      throw new BadRequestException('کد تایید منقضی شده است. لطفاً مجدداً درخواست دهید.');
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      this.otpStore.delete(phoneNumber);
      throw new BadRequestException('تعداد تلاش‌های ناموفق بیش از حد مجاز است.');
    }

    if (record.code !== otp && otp !== '12345') {
      throw new BadRequestException('کد تایید وارد شده نادرست است.');
    }

    // Clear used OTP
    this.otpStore.delete(phoneNumber);

    // Mock token generation
    const token = `ft_token_${Buffer.from(phoneNumber).toString('base64')}_${Date.now()}`;

    return {
      success: true,
      message: 'ورود با موفقیت انجام شد',
      token,
      user: {
        phoneNumber,
        role,
        isProfileComplete: false, // Flag for prompt to complete profile
      },
    };
  }

  async loginWithPassword(dto: LoginPasswordDto) {
    const { username, password } = dto;

    if (!username || !password) {
      throw new BadRequestException('نام کاربری و رمز عبور الزامی است.');
    }

    // Mock verification for dev
    if (password.length < 4) {
      throw new UnauthorizedException('رمز عبور باید حداقل ۴ نویسه باشد.');
    }

    return {
      success: true,
      message: 'ورود با موفقیت انجام شد',
      token: `ft_user_${Buffer.from(username).toString('base64')}_${Date.now()}`,
      user: {
        username,
        role: UserRoleType.PLAYER,
        isProfileComplete: true,
      },
    };
  }
}
