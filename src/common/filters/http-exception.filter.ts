import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorCodeString } from '@common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let hasValidationErrors = false;
    let code: ErrorCodeString | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        code = (responseObj.code as ErrorCodeString) || code;
        if (Array.isArray(responseObj?.message)) {
          hasValidationErrors = true;
        }
      }
    } else {
      this.logger.error(`Unhandled exception: ${exception?.message}`, exception?.stack);
      code = code || 'INTERNAL_SERVER_ERROR';
    }

    if (!code) {
      if (hasValidationErrors) {
        code = ErrorCode.VALIDATION_ERROR;
      } else {
        const statusToErrorCode: Record<number, ErrorCodeString> = {
          [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
          [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
          [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
          [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
          [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorCode.INTERNAL_SERVER_ERROR,
        };
        code = statusToErrorCode[status] || ErrorCode.INTERNAL_SERVER_ERROR;
      }
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} - ${status}`, JSON.stringify(errorResponse));
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status}`);
    }

    response.status(status).json(errorResponse);
  }
}


