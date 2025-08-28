import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { FriendsController } from './friends/friends.controller';
import { EventsController } from './events/events.controller';
import { LeaderboardController } from './leaderboard/leaderboard.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { MicroserviceClients } from './common/clients/microservice-clients';
import { JwtStrategy } from './common/strategies/jwt-auth.strategy';
import {
  databaseConfig,
  Event,
  EventAcknowledgment,
  Friendship,
  Token,
  User,
} from '@eventure/shared-lib';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    TypeOrmModule.forFeature([
      User,
      Event,
      EventAcknowledgment,
      Friendship,
      Token,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'fallback-secret',
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [
    AuthController,
    UsersController,
    FriendsController,
    EventsController,
    LeaderboardController,
  ],
  providers: [MicroserviceClients, JwtStrategy, WebsocketGateway],
})
export class AppModule {}
