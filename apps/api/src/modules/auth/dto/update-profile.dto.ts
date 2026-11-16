import { IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: '09123456789', description: 'شماره تلفن همراه کاربر' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن معتبر نیست' })
  phoneNumber: string;

  @ApiProperty({ example: 'علی رضایی', description: 'نام و نام خانوادگی' })
  @IsString()
  @MinLength(3, { message: 'نام و نام خانوادگی باید حداقل ۳ حرف باشد' })
  fullName: string;

  @ApiProperty({ example: '0012345678', description: 'کد ملی' })
  @IsString()
  @MinLength(8, { message: 'کد ملی باید حداقل ۸ رقم باشد' })
  nationalId: string;

  @ApiProperty({ example: '16', description: 'سن به سال' })
  @IsString()
  age: string;

  @ApiProperty({ example: '178', description: 'قد به سانتی‌متر' })
  @IsString()
  height: string;

  @ApiProperty({ example: '70', description: 'وزن به کیلوگرم' })
  @IsString()
  weight: string;

  @ApiPropertyOptional({ example: 'راست', description: 'پای تخصصی' })
  @IsOptional()
  @IsString()
  preferredFoot?: string;

  @ApiPropertyOptional({ example: 'هافبک میانی / بازیساز', description: 'پست تخصصی' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: 'آدرس تصویر پروفایل یا داده base64' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '۳ سال مدرسه فوتبال', description: 'سابقه ورزشی' })
  @IsOptional()
  @IsString()
  experienceYears?: string;

  @ApiPropertyOptional({ example: '32', description: 'دور بازو (سانتی‌متر)' })
  @IsOptional()
  @IsString()
  bicep?: string;

  @ApiPropertyOptional({ example: '38', description: 'دور ساق (سانتی‌متر)' })
  @IsOptional()
  @IsString()
  calf?: string;

  @ApiPropertyOptional({ example: '95', description: 'دور سینه (سانتی‌متر)' })
  @IsOptional()
  @IsString()
  chest?: string;

  @ApiPropertyOptional({ example: '55', description: 'دور ران (سانتی‌متر)' })
  @IsOptional()
  @IsString()
  thigh?: string;

  @ApiPropertyOptional({ description: 'آدرس یا دیتای تصویر کامل بدن' })
  @IsOptional()
  @IsString()
  bodyPhotoUrl?: string;
}
