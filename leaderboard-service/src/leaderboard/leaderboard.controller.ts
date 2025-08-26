import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LeaderboardService } from './leaderboard.service';

@Controller()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @MessagePattern('getLeaderboard')
  async getLeaderboard(@Payload() data: { userId: string }) {
    return this.leaderboardService.getLeaderboard(data.userId);
  }

  @MessagePattern('getEventLeaderboard')
  async getEventLeaderboard(@Payload() data: { eventId: string }) {
    return this.leaderboardService.getEventLeaderboard(data.eventId);
  }
}
