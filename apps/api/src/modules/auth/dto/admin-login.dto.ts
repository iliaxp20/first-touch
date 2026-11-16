import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'نام کاربری ادمین', example: 'admin' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'رمز عبور ادمین' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  password: string;
}
