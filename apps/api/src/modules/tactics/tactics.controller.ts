import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TacticsService } from './tactics.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('tactics')
export class TacticsController {
  constructor(private readonly tacticsService: TacticsService) {}

  @Get('boards')
  getAllBoards() {
    return {
      success: true,
      boards: this.tacticsService.getAllBoards(),
    };
  }

  @Post('boards')
  createBoard(@Body() dto: CreateBoardDto) {
    return {
      success: true,
      board: this.tacticsService.createBoard(dto),
    };
  }

  @Get('boards/:id')
  getBoard(@Param('id') id: string) {
    return {
      success: true,
      board: this.tacticsService.getBoard(id),
    };
  }

  @Put('boards/:id')
  saveBoard(@Param('id') id: string, @Body() body: any) {
    return {
      success: true,
      board: this.tacticsService.saveFullBoard(id, body),
    };
  }

  @Delete('boards/:id')
  deleteBoard(@Param('id') id: string) {
    const success = this.tacticsService.deleteBoard(id);
    return {
      success,
    };
  }

  @Post('boards/:id/reset')
  resetBoard(@Param('id') id: string) {
    return {
      success: true,
      board: this.tacticsService.resetBoard(id),
    };
  }
}
