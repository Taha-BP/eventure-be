import {
  AuthResponse,
  UserResponse,
  FriendResponse,
  EventResponse,
  AcknowledgeEventResponse,
  LeaderboardResponse,
} from '@eventure/shared-lib';

export type MicroserviceResponse<T> = T | { error: string; message: string };

export type AuthMicroserviceResponse = MicroserviceResponse<AuthResponse>;
export type UsersMicroserviceResponse = MicroserviceResponse<UserResponse[]>;
export type FriendsMicroserviceResponse = MicroserviceResponse<
  FriendResponse[]
>;
export type AddFriendMicroserviceResponse =
  MicroserviceResponse<FriendResponse>;
export type EventsMicroserviceResponse = MicroserviceResponse<EventResponse>;
export type AcknowledgeEventMicroserviceResponse =
  MicroserviceResponse<AcknowledgeEventResponse>;
export type LeaderboardMicroserviceResponse =
  MicroserviceResponse<LeaderboardResponse>;
