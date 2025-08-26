import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardEntryDto {
  @ApiProperty({
    description: 'Friend user ID',
    example: 'user-456',
    type: String,
  })
  friendId: string;

  @ApiProperty({
    description: 'Friend full name',
    example: 'Jane Smith',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Total points earned from acknowledging events',
    example: 250,
    type: Number,
  })
  points: number;
}

export class LeaderboardResponse {
  @ApiProperty({
    description: 'List of friends with their points',
    type: [LeaderboardEntryDto],
  })
  leaderboard: LeaderboardEntryDto[];
}

export class EventLeaderboardResponse {
  @ApiProperty({
    description: 'Event ID',
    example: 'event-123',
    type: String,
  })
  eventId: string;

  @ApiProperty({
    description: 'List of friends who acknowledged this event with their points',
    type: [LeaderboardEntryDto],
  })
  leaderboard: LeaderboardEntryDto[];
}
