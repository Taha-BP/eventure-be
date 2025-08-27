import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Not, Repository, UpdateResult } from 'typeorm';
import { UserResponse, User } from '@eventure/shared-lib';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers(currentUserId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { id: Not(currentUserId) },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  getUserById(id: string): Promise<UserResponse | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });
  }

  getUserByEmail(email: string): Promise<UserResponse | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  createUser(userData: Partial<User>): Promise<User> {
    return this.userRepository.save(userData);
  }

  updateUser(id: string, userData: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update(id, userData);
  }

  deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
