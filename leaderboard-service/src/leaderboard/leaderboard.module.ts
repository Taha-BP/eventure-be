import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Event,
  EventAcknowledgment,
  Friendship,
  Token,
  User,
} from '@eventure/shared-lib';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventAcknowledgment,
      User,
      Friendship,
      Token,
    ]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}
