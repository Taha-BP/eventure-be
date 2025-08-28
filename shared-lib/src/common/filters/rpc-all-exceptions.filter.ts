import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class RpcAllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      throw exception;
    }
    throw new RpcException({
      message: exception.message || "Internal error",
      code: exception.code,
      detail: exception.detail,
      stack: exception.stack,
    });
  }
}
