import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('احراز هویت (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ارسال کد OTP به شماره موبایل' })
  @ApiResponse({ status: 200, description: 'کد با موفقیت ارسال شد' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تایید کد OTP و ورود به سیستم' })
  @ApiResponse({ status: 200, description: 'ورود موفق' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ورود با نام کاربری و کلمه عبور' })
  @ApiResponse({ status: 200, description: 'ورود موفق' })
  async loginPassword(@Body() dto: LoginPasswordDto) {
    return this.authService.loginWithPassword(dto);
  }

  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'احراز هویت امن مدیر ارشد سیستم' })
  @ApiResponse({ status: 200, description: 'ورود موفق ادمین' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }
}
