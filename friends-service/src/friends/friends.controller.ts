import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FriendsService } from './friends.service';

@Controller()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @MessagePattern('getFriends')
  async getFriends(@Payload() data: { userId: string }) {
    return this.friendsService.getFriends(data.userId);
  }

  @MessagePattern('addFriend')
  async addFriend(
    @Payload() data: { userId: string; friendId?: string; email?: string },
  ) {
    const friendIdOrEmail = data.friendId || data.email;
    if (!friendIdOrEmail) {
      throw new Error('Either friendId or email must be provided');
    }
    return this.friendsService.addFriend(data.userId, friendIdOrEmail);
  }

  @MessagePattern('getFriendIds')
  async getFriendIds(@Payload() data: { userId: string }) {
    return this.friendsService.getFriendIds(data.userId);
  }
}
