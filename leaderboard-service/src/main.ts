import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.LEADERBOARD_SERVICE_HOST || 'localhost',
      port: process.env.LEADERBOARD_SERVICE_PORT || 3005,
    },
  });

  const configService = app.get(ConfigService);

  await app.listen();

  console.log(
    `🏆 Leaderboard Service is running on: ${configService.get('LEADERBOARD_SERVICE_HOST') || 'localhost'}:${configService.get('LEADERBOARD_SERVICE_PORT') || 3005}`,
  );
}
void bootstrap();
