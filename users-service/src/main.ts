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
      host: process.env.USERS_SERVICE_HOST || 'localhost',
      port: process.env.USERS_SERVICE_PORT || 3002,
    },
  });

  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new RpcExceptionInterceptor());
  app.useGlobalFilters(new RpcAllExceptionsFilter());

  await app.listen();

  console.log(
    `👥 Users Service is running on: ${configService.get('USERS_SERVICE_HOST') || 'localhost'}:${configService.get('USERS_SERVICE_PORT') || 3002}`,
  );
}
void bootstrap();
