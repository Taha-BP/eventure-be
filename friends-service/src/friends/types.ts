import { AddFriendDto, User } from '@eventure/shared-lib';

export type AddFriendPayload = AddFriendDto & {
  currentUser: User;
};
