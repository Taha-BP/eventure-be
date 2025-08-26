import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Something went wrong';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle HTTP exceptions (like UnauthorizedException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    // Handle RpcException
    else if (exception instanceof RpcException) {
      const error = exception.getError() as
        | { message?: string; statusCode?: number; code?: number }
        | string;

      if (typeof error === 'string') {
        message = error;
      } else if (error) {
        message = error.message ?? message;
        status = error.statusCode ?? error.code ?? status;
      }
    }
    // Handle serialized RPC exceptions (from TCP transport)
    else if (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception
    ) {
      const rpcError = exception as {
        message?: string;
        statusCode?: number;
        code?: number;
      };
      message = rpcError.message ?? message;
      status = rpcError.statusCode ?? rpcError.code ?? status;
    }
    // Handle other exceptions
    else if (exception instanceof Error) {
      message = exception.message;
    }

    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
