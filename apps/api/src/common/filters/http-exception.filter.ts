import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? exception.getResponse()
      : 'خطای داخلی در پردازش درخواست رخ داد.';

    const isProduction = process.env.NODE_ENV === 'production';
    const errorMsg = exception instanceof Error ? exception.message : JSON.stringify(exception);

    // Only log 500+ as server ERROR with stack trace; log 4xx as WARN/DEBUG without dumping stack traces
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} Status: ${status} - Error: ${errorMsg}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status === HttpStatus.NOT_FOUND) {
      this.logger.debug(`[${request.method}] ${request.url} Not Found (404)`);
    } else {
      this.logger.warn(`[${request.method}] ${request.url} Status: ${status} - Message: ${errorMsg}`);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'object' && message !== null && 'message' in message
          ? (message as any).message
          : typeof message === 'string'
          ? message
          : 'خطا در انجام عملیات',
      ...(isProduction
        ? {}
        : {
            details:
              exception instanceof Error ? exception.message : undefined,
          }),
    };

    response.status(status).json(errorResponse);
  }
}
