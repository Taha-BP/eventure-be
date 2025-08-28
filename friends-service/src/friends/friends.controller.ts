import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FriendsService } from './friends.service';
import { MessageResponse } from '@eventure/shared-lib';
import type { AddFriendPayload } from './types';

@Controller()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @MessagePattern('getFriends')
  async getFriends(@Payload() data: { userId: string }) {
    return this.friendsService.getFriends(data.userId);
  }

  @MessagePattern('addFriend')
  async addFriend(
    @Payload()
    payload: AddFriendPayload,
  ): Promise<MessageResponse> {
    return this.friendsService.addFriend(payload);
  }
}
