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
      host: process.env.FRIENDS_SERVICE_HOST || 'localhost',
      port: process.env.FRIENDS_SERVICE_PORT || 3003,
    },
  });

  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new RpcExceptionInterceptor());
  app.useGlobalFilters(new RpcAllExceptionsFilter());

  await app.listen();

  console.log(
    `👫 Friends Service is running on: ${configService.get('FRIENDS_SERVICE_HOST') || 'localhost'}:${configService.get('FRIENDS_SERVICE_PORT') || 3003}`,
  );
}
void bootstrap();
