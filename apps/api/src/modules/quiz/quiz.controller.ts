import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';

@ApiTags('باشگاه هوش و مسابقه (Football Quiz)')
@Controller('quiz/questions')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @ApiOperation({ summary: 'دریافت بانک سوالات مسابقه فوتبال' })
  async getQuestions() {
    return this.quizService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'افزودن سوال جدید به مسابقه' })
  @ApiResponse({ status: 201, description: 'سوال با موفقیت ایجاد شد' })
  async createQuestion(@Body() dto: CreateQuizQuestionDto) {
    return this.quizService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف سوال از مسابقه' })
  @ApiResponse({ status: 200, description: 'سوال با موفقیت حذف شد' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.delete(id);
  }
}
