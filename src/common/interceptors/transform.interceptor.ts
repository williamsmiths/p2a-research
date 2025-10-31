import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data as ApiResponse<T>;
        }
        const statusCode = response.statusCode || HttpStatus.OK;
        return {
          success: true,
          statusCode,
          data: (data as T) ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}


