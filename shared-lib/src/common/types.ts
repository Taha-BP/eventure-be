export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  password: string;
}

export interface Friend extends BaseEntity {
  userId: string;
  friendId: string;
}

export interface Event extends BaseEntity {
  title: string;
  description?: string;
  mediaPath: string;
  creatorId: string;
}

export interface EventAcknowledgment extends BaseEntity {
  eventId: string;
  userId: string;
  pointsEarned: number;
  order: number;
}

export interface LeaderboardEntry {
  friendId: string;
  name: string;
  points: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
