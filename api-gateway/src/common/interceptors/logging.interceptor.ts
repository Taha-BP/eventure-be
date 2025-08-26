import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body } = request;

    const startTime = Date.now();

    // Log request details and body in one line
    const bodyInfo =
      body && Object.keys(body).length > 0
        ? ` | Body: ${JSON.stringify(this.sanitizeBody(body))}`
        : '';
    this.logger.log(`[REQUEST] ${method} ${url}${bodyInfo}`);

    return next.handle().pipe(
      tap((responseBody) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const statusCode = response.statusCode;

        // Log response details and body in one line
        const responseInfo = responseBody
          ? ` | Response: ${JSON.stringify(responseBody).substring(0, 500)}${JSON.stringify(responseBody).length > 500 ? '...' : ''}`
          : '';
        this.logger.log(
          `[RESPONSE] ${method} ${url} - ${statusCode} (${responseTime}ms)${responseInfo}`,
        );
      }),
      catchError((error: unknown) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const errorObj = error as {
          status?: number;
          message?: string;
          stack?: string;
        };
        const statusCode = errorObj.status || 500;

        // Log error details in one line
        this.logger.error(
          `[ERROR] ${method} ${url} - ${statusCode} (${responseTime}ms) - ${errorObj.message || 'Unknown error'}`,
        );

        throw error;
      }),
    );
  }

  private sanitizeBody(body: Record<string, any>): Record<string, any> {
    // Remove sensitive fields from logging
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
