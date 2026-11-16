import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDrillDto {
  @ApiProperty({ description: 'شماره دسته‌بندی (۱ تا ۱۲)', example: 1 })
  @IsNumber()
  @IsOptional()
  categoryIndex?: number;

  @ApiProperty({ description: 'عنوان دسته‌بندی', example: 'تمرینات نردبان چابکی (Agility Ladder)' })
  @IsString()
  @IsOptional()
  categoryTitle?: string;

  @ApiProperty({ description: 'نام انگلیسی تمرین', example: 'One Foot In Each Box' })
  @IsString()
  @IsOptional()
  englishName?: string;

  @ApiProperty({ description: 'نام فارسی تمرین', example: 'یک پا در هر خانه' })
  @IsString()
  persianName: string;

  @ApiPropertyOptional({ description: 'آدرس تصویر یا دیاگرام تمرین' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'آدرس ویدیو تمرین' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'توضیحات و نکات تکنیکی تمرین' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'سطح دشواری', example: 'INTERMEDIATE' })
  @IsString()
  @IsOptional()
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';

  @ApiPropertyOptional({ description: 'تجهیزات مورد نیاز', example: 'نردبان چابکی' })
  @IsString()
  @IsOptional()
  equipment?: string;

  @ApiPropertyOptional({ description: 'مهارت هدف', example: 'چابکی، لمس اول و سرعت پا' })
  @IsString()
  @IsOptional()
  targetSkill?: string;

  @ApiPropertyOptional({ description: 'کلید دسته‌بندی' })
  @IsString()
  @IsOptional()
  categoryKey?: string;

  @ApiPropertyOptional({ description: 'مدت زمان' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ description: 'ست و تکرار' })
  @IsString()
  @IsOptional()
  setsReps?: string;
}
