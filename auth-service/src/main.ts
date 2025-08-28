import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  RpcAllExceptionsFilter,
  RpcExceptionInterceptor,
} from '@eventure/shared-lib';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST || 'localhost',
      port: process.env.AUTH_SERVICE_PORT || 3001,
    },
  });

  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new RpcExceptionInterceptor());
  app.useGlobalFilters(new RpcAllExceptionsFilter());

  await app.listen();

  console.log(
    `🔐 Auth Service is running on: ${configService.get('AUTH_SERVICE_HOST') || 'localhost'}:${configService.get('AUTH_SERVICE_PORT') || 3001}`,
  );
}
void bootstrap();
