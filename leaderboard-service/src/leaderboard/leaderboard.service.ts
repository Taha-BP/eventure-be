import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  LeaderboardEntryDto,
  User,
  EventAcknowledgment,
  Event,
} from '@eventure/shared-lib';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventAcknowledgment)
    private readonly acknowledgmentRepository: Repository<EventAcknowledgment>,
  ) {}

  async getLeaderboard(userId: string): Promise<LeaderboardEntryDto[]> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all friends of the user (this would need to be fetched from friends service)
    // For now, we'll get all users who have acknowledged events created by this user
    const userEvents = this.getUserEvents();

    if (userEvents.length === 0) {
      return [];
    }

    const eventIds = userEvents.map((event) => event.id);

    // Get all acknowledgments for user's events
    const acknowledgments = await this.acknowledgmentRepository.find({
      where: { eventId: In(eventIds) },
      relations: ['user'],
    });

    // Calculate points for each friend
    const leaderboard: { [friendId: string]: number } = {};

    for (const acknowledgment of acknowledgments) {
      const friendId = acknowledgment.userId;
      if (!leaderboard[friendId]) {
        leaderboard[friendId] = 0;
      }
      leaderboard[friendId] += acknowledgment.pointsEarned;
    }

    // Convert to array and sort by points
    const leaderboardArray = Object.entries(leaderboard)
      .map(([friendId, points]) => {
        const acknowledgment = acknowledgments.find(
          (a) => a.userId === friendId,
        );
        const userName = acknowledgment?.user
          ? acknowledgment.user.name
          : 'Unknown';
        return {
          friendId,
          name: userName,
          points,
        };
      })
      .sort((a, b) => b.points - a.points);

    return leaderboardArray;
  }

  async getEventLeaderboard(eventId: string): Promise<LeaderboardEntryDto[]> {
    const eventAcknowledgments = await this.acknowledgmentRepository.find({
      where: { eventId },
      order: { order: 'ASC' },
      relations: ['user'],
    });

    return eventAcknowledgments.map((ack) => ({
      friendId: ack.userId,
      name: ack.user ? ack.user.name : 'Unknown',
      points: ack.pointsEarned,
    }));
  }

  private getUserEvents(): Event[] {
    // This would typically come from the events service
    // For now, we'll return an empty array
    return [];
  }
}
