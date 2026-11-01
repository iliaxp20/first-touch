import { IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره موبایل کاربر' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن معتبر نیست. مثال: 09123456789' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'REF12345', description: 'کد معرف (اختیاری)' })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
