import { Module } from '@nestjs/common';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '@eventure/shared-lib';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    LeaderboardModule,
  ],
})
export class AppModule {}
