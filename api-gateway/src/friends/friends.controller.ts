import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  AddFriendDto,
  FriendResponse,
  MessageResponse,
} from '@eventure/shared-lib';
import { Observable } from 'rxjs';
import { type AuthenticatedRequest } from '@eventure/shared-lib';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

@ApiTags('friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FriendsController {
  constructor(private readonly microserviceClients: MicroserviceClients) {}

  @Get()
  @ApiOperation({ summary: 'Get user friends' })
  @ApiResponse({
    status: 200,
    description: 'List of user friends retrieved successfully',
    type: [FriendResponse],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getFriends(@Request() req: RequestWithUser): Observable<FriendResponse[]> {
    const friendsClient = this.microserviceClients.getFriendsClient();
    return friendsClient.send<FriendResponse[]>('getFriends', {
      userId: req.user.userId,
    });
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a friend' })
  @ApiBody({ type: AddFriendDto })
  @ApiResponse({
    status: 201,
    description: 'Friend added successfully',
    type: MessageResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or friendship already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  addFriend(
    @Body() addFriendDto: AddFriendDto,
    @Request() req: AuthenticatedRequest,
  ): Observable<MessageResponse> {
    return this.microserviceClients
      .getFriendsClient()
      .send<MessageResponse>('addFriend', {
        ...addFriendDto,
        currentUserId: req.user.id,
      });
  }
}
