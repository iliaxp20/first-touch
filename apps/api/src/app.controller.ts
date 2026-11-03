import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('سیستم و وضعیت سرور (System)')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'بررسی وضعیت آنلاین بودن سرور' })
  getRoot() {
    return {
      status: 'ok',
      service: 'First Touch (فرست تاچ) API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      docs: '/api/docs',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'بررسی سلامت سرور' })
  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
