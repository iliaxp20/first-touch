import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'نام کاربری ادمین', example: 'ft_admin' })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'رمز عبور امن ادمین' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
