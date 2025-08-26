export interface EventCreatedPayload {
  eventId: string;
  title: string;
  creatorId: string;
  timestamp: string;
}

export interface LeaderboardUpdatedPayload {
  eventId: string;
  leaderboard: {
    friendId: string;
    points: number;
  }[];
}

export interface WebSocketEvent {
  type: 'event_created' | 'leaderboard_updated';
  payload: EventCreatedPayload | LeaderboardUpdatedPayload;
}
