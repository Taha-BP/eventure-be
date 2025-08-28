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
import type { AddFriendPayload } from './types';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getFriends(currentUserId: string): Promise<FriendResponse[]> {
    return this.friendshipRepository.find({
      where: { userId: currentUserId },
      relations: { friend: true },
      select: {
        id: true,
        createdAt: true,
        friend: { id: true, name: true, email: true },
      },
    });
  }

  async addFriend(payload: AddFriendPayload): Promise<MessageResponse> {
    const { currentUser, friendId, email } = payload;

    const friend = await this.userRepository.findOne({
      where: { id: friendId, email },
    });

    if (!friend) {
      throw new NotFoundException('User not found');
    }

    if (friend.id === currentUser.id) {
      throw new BadRequestException("Can't add yourself as a friend");
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: [
        { userId: currentUser.id, friendId: friend.id },
        { userId: friend.id, friendId: currentUser.id },
      ],
    });

    if (existingFriendship) {
      throw new ConflictException('Friendship already exists');
    }

    await this.friendshipRepository.save(
      this.friendshipRepository.create([
        { user: currentUser, friend },
        { user: friend, friend: currentUser },
      ]),
    );

    return { message: 'Friendship added successfully' };
  }
}
