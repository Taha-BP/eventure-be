import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Event,
  EventAcknowledgment,
  Friendship,
  Token,
  User,
} from '@eventure/shared-lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventAcknowledgment,
      User,
      Friendship,
      Token,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
