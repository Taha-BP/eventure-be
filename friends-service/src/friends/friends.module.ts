import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
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
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
