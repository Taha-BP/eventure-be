import { Request } from "express";
import { User } from "../entities";

export interface AuthenticatedRequest extends Request {
  user: User;
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

export interface LeaderboardEntry {
  friendId: string;
  name: string;
  points: number;
}
