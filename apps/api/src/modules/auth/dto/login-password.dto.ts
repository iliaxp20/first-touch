import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPasswordDto {
  @ApiProperty({ example: 'player10' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'secret123' })
  @IsString()
  password: string;
}
