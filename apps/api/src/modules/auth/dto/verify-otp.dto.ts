import { IsString, Matches, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRoleType {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  PARENT = 'PARENT',
}

export class VerifyOtpDto {
  @ApiProperty({ example: '09123456789' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره تلفن معتبر نیست' })
  phoneNumber: string;

  @ApiProperty({ example: '12345', description: 'کد تایید پیامک شده' })
  @IsString()
  otp: string;

  @ApiPropertyOptional({ enum: UserRoleType, default: UserRoleType.PLAYER })
  @IsOptional()
  @IsEnum(UserRoleType)
  role?: UserRoleType;
}

export class LoginPasswordDto {
  @ApiProperty({ example: 'player10' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  password: string;
}
