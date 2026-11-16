import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateQuizQuestionDto {
  @ApiProperty({ description: 'دسته‌بندی سوال' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'کلاس رنگی نشان دسته‌بندی', required: false })
  @IsString()
  @IsOptional()
  categoryColor?: string;

  @ApiProperty({ description: 'متن سوال' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ description: 'چهار گزینه پاسخ', type: [String] })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({ description: 'ایندکس گزینه صحیح (۰ تا ۳)' })
  @IsNumber()
  correctIndex: number;

  @ApiProperty({ description: 'توضیحات پاسخ صحیح' })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty({ description: 'جایزه سکه' })
  @IsNumber()
  coinReward: number;

  @ApiProperty({ description: 'جایزه امتیاز XP' })
  @IsNumber()
  xpReward: number;
}
