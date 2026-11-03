import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  creatorName?: string;

  @IsOptional()
  @IsString()
  creatorPhone?: string;
}
