import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodeString } from '@common';

export class BusinessException extends HttpException {
  constructor(statusCode: HttpStatus, code: ErrorCodeString) {
    super(
      {
        success: false,
        statusCode,
        code,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class NotFoundException extends BusinessException {
  constructor() {
    super(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}

export class ConflictException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.CONFLICT) {
    super(HttpStatus.CONFLICT, code);
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.UNAUTHORIZED) {
    super(HttpStatus.UNAUTHORIZED, code);
  }
}

export class ForbiddenException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.FORBIDDEN) {
    super(HttpStatus.FORBIDDEN, code);
  }
}

export class ValidationException extends BusinessException {
  constructor(code: ErrorCodeString = ErrorCode.VALIDATION_ERROR) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, code);
  }
}


