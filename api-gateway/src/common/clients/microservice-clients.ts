import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicroserviceClients {
  private authClient: ClientProxy;
  private usersClient: ClientProxy;
  private friendsClient: ClientProxy;
  private eventsClient: ClientProxy;
  private leaderboardClient: ClientProxy;

  constructor(private configService: ConfigService) {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host:
          this.configService.get<string>('microservices.auth.host') ||
          'localhost',
        port: this.configService.get<number>('microservices.auth.port') || 3001,
      },
    });

    this.usersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host:
          this.configService.get<string>('microservices.users.host') ||
          'localhost',
        port:
          this.configService.get<number>('microservices.users.port') || 3002,
      },
    });

    this.friendsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host:
          this.configService.get<string>('microservices.friends.host') ||
          'localhost',
        port:
          this.configService.get<number>('microservices.friends.port') || 3003,
      },
    });

    this.eventsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host:
          this.configService.get<string>('microservices.events.host') ||
          'localhost',
        port:
          this.configService.get<number>('microservices.events.port') || 3004,
      },
    });

    this.leaderboardClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host:
          this.configService.get<string>('microservices.leaderboard.host') ||
          'localhost',
        port:
          this.configService.get<number>('microservices.leaderboard.port') ||
          3005,
      },
    });
  }

  getAuthClient(): ClientProxy {
    return this.authClient;
  }

  getUsersClient(): ClientProxy {
    return this.usersClient;
  }

  getFriendsClient(): ClientProxy {
    return this.friendsClient;
  }

  getEventsClient(): ClientProxy {
    return this.eventsClient;
  }

  getLeaderboardClient(): ClientProxy {
    return this.leaderboardClient;
  }
}
