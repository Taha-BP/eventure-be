import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FriendResponse,
  Friendship,
  MessageResponse,
  User,
} from '@eventure/shared-lib';
import type { AddFriendPayload } from './types';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getFriends(userId: string): Promise<FriendResponse[]> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new RpcException(new NotFoundException('User not found'));
    }

    const userFriendships = await this.friendshipRepository.find({
      where: { userId },
      relations: ['friend'],
    });

    return userFriendships.map((friendship: Friendship) => {
      if (!friendship.friend) {
        throw new RpcException(
          new Error('Friend relationship is missing user data'),
        );
      }
      return {
        id: friendship.id,
        userId: friendship.userId,
        friendId: friendship.friendId,
        friend: {
          id: friendship.friend.id,
          name: friendship.friend.name,
          email: friendship.friend.email,
        },
        createdAt: friendship.createdAt,
      };
    });
  }

  async addFriend(payload: AddFriendPayload): Promise<MessageResponse> {
    const { currentUserId, friendId, email } = payload;

    const friendIdOrEmail = friendId || email;

    const friend = await this.userRepository.findOne({
      where: [{ id: friendIdOrEmail }, { email: friendIdOrEmail }],
    });

    if (!friend) {
      throw new RpcException(new NotFoundException('User not found'));
    }

    if (friend.id === currentUserId) {
      throw new RpcException(
        new BadRequestException("Can't add yourself as a friend"),
      );
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId: currentUserId, friendId: friend.id },
        { userId: friend.id, friendId: currentUserId },
      ],
    });

    if (existingFriendship) {
      throw new RpcException(
        new ConflictException('Friendship already exists'),
      );
    }

    await this.friendshipRepository.save(
      this.friendshipRepository.create([
        {
          userId: currentUserId,
          friendId: friend.id,
        },
        {
          userId: friend.id,
          friendId: currentUserId,
        },
      ]),
    );

    return { message: 'Friendship added successfully' };
  }
}
