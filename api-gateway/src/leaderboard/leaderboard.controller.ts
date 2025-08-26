import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LeaderboardResponse } from '@eventure/shared-lib';
import { Observable } from 'rxjs';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

@ApiTags('leaderboard')
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LeaderboardController {
  constructor(private readonly microserviceClients: MicroserviceClients) {}

  @Get()
  @ApiOperation({ summary: 'Get user leaderboard' })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getLeaderboard(
    @Request() req: RequestWithUser,
  ): Observable<LeaderboardResponse> {
    const leaderboardClient = this.microserviceClients.getLeaderboardClient();
    return leaderboardClient.send<LeaderboardResponse>('getLeaderboard', {
      userId: req.user.userId,
    });
  }
}
