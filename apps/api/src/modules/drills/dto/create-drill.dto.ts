import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDrillDto {
  @ApiProperty({ description: 'شماره دسته‌بندی (۱ تا ۱۲)', example: 1 })
  categoryIndex: number;

  @ApiProperty({ description: 'عنوان دسته‌بندی', example: 'تمرینات نردبان چابکی (Agility Ladder)' })
  categoryTitle: string;

  @ApiProperty({ description: 'نام انگلیسی تمرین', example: 'One Foot In Each Box' })
  englishName: string;

  @ApiProperty({ description: 'نام فارسی تمرین', example: 'یک پا در هر خانه' })
  persianName: string;

  @ApiPropertyOptional({ description: 'آدرس تصویر یا دیاگرام تمرین' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'توضیحات و نکات تکنیکی تمرین' })
  description?: string;

  @ApiPropertyOptional({ description: 'سطح دشواری', example: 'INTERMEDIATE' })
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';

  @ApiPropertyOptional({ description: 'تجهیزات مورد نیاز', example: 'نردبان چابکی' })
  equipment?: string;

  @ApiPropertyOptional({ description: 'مهارت هدف', example: 'چابکی، لمس اول و سرعت پا' })
  targetSkill?: string;
}
