import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { FriendsController } from './friends/friends.controller';
import { EventsController } from './events/events.controller';
import { LeaderboardController } from './leaderboard/leaderboard.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { MicroserviceClients } from './common/clients/microservice-clients';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
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
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    FriendsController,
    EventsController,
    LeaderboardController,
  ],
  providers: [AppService, MicroserviceClients, JwtStrategy, WebsocketGateway],
})
export class AppModule {}
