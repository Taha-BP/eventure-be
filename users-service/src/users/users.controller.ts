import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { User } from '@eventure/shared-lib';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('getAllUsers')
  async getAllUsers(@Payload() data: { currentUserId: string }) {
    return this.usersService.getAllUsers(data.currentUserId);
  }

  @MessagePattern('getUserById')
  async getUserById(@Payload() data: { id: string }) {
    return this.usersService.getUserById(data.id);
  }

  @MessagePattern('getUserByEmail')
  async getUserByEmail(@Payload() data: { email: string }) {
    return this.usersService.getUserByEmail(data.email);
  }

  @MessagePattern('addUser')
  async addUser(@Payload() user: Partial<User>) {
    return this.usersService.createUser(user);
  }
}
