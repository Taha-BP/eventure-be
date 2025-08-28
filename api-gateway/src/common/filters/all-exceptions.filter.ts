import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception?.message || 'Something went wrong';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if ('error' in exception) {
      exception = exception.error;
    }

    if ('response' in exception) {
      message = Array.isArray(exception.response.message)
        ? exception.response.message.join(', ')
        : exception.response.message || message;
      status =
        exception.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      message = exception.message || message;
      status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .status(status)
      .json({ statusCode: status, message: message });
  }
}
