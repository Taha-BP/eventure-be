import { AddFriendDto } from '@eventure/shared-lib';

export type AddFriendPayload = AddFriendDto & {
  currentUserId: string;
};
