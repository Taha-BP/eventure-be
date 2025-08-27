import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FriendsService } from './friends.service';
import { MessageResponse } from '@eventure/shared-lib';

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
    data: {
      currentUserId: string;
      friendId?: string;
      email?: string;
    },
  ): Promise<MessageResponse> {
    const friendIdOrEmail = data.friendId || data.email;
    if (!friendIdOrEmail) {
      throw new Error('Either friendId or email must be provided');
    }
    return this.friendsService.addFriend(data.currentUserId, friendIdOrEmail);
  }
}
