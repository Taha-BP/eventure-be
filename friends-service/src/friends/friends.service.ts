import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendResponse, Friendship, User } from '@eventure/shared-lib';

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
    userId: string,
    friendIdOrEmail: string,
  ): Promise<FriendResponse> {
    // Prevent self-addition
    if (userId === friendIdOrEmail) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find friend by ID or email
    let friend: User | null;
    if (friendIdOrEmail.includes('@')) {
      friend = await this.userRepository.findOne({
        where: { email: friendIdOrEmail },
      });
      if (!friend) {
        throw new NotFoundException('User not found with this email address');
      }
    } else {
      friend = await this.userRepository.findOne({
        where: { id: friendIdOrEmail },
      });
      if (!friend) {
        throw new NotFoundException('User not found with this ID');
      }
    }

    // Check if friendship already exists
    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId, friendId: friend.id },
        { userId: friend.id, friendId: userId },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException('Friendship already exists');
    }

    // Create mutual friendship
    const friendship1 = this.friendshipRepository.create({
      userId,
      friendId: friend.id,
    });

    const friendship2 = this.friendshipRepository.create({
      userId: friend.id,
      friendId: userId,
    });

    await this.friendshipRepository.save([friendship1, friendship2]);

    return {
      id: friendship1.id,
      userId: friendship1.userId,
      friendId: friendship1.friendId,
      friend: {
        id: friend.id,
        name: friend.name,
        email: friend.email,
      },
      createdAt: friendship1.createdAt,
    };
  }

  async getFriendIds(userId: string): Promise<string[]> {
    const userFriendships = await this.friendshipRepository.find({
      where: { userId },
    });
    return userFriendships.map((f) => f.friendId);
  }
}
