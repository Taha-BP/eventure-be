import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FriendResponse,
  Friendship,
  MessageResponse,
  User,
} from '@eventure/shared-lib';

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
      throw new NotFoundException('User not found');
    }

    const userFriendships = await this.friendshipRepository.find({
      where: { userId },
      relations: ['friend'],
    });

    return userFriendships.map((friendship: Friendship) => {
      if (!friendship.friend) {
        throw new Error('Friend relationship is missing user data');
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

  async addFriend(
    currentUserId: string,
    friendIdOrEmail: string,
  ): Promise<MessageResponse> {
    if (currentUserId === friendIdOrEmail) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    const friend = await this.userRepository.findOne({
      where: [{ id: friendIdOrEmail }, { email: friendIdOrEmail }],
    });

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    if (friend.id === currentUserId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId: currentUserId, friendId: friend.id },
        { userId: friend.id, friendId: currentUserId },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException('Friendship already exists');
    }

    const friendship1 = this.friendshipRepository.create({
      userId: currentUserId,
      friendId: friend.id,
    });

    const friendship2 = this.friendshipRepository.create({
      userId: friend.id,
      friendId: currentUserId,
    });

    await this.friendshipRepository.save([friendship1, friendship2]);

    return { message: 'Friendship added successfully' };
  }
}
