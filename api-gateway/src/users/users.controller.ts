import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { Observable } from 'rxjs';
import { type AuthenticatedRequest } from '@eventure/shared-lib';
import { CustomJwtAuthGuard } from '../common/guards/custom-jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly microserviceClients: MicroserviceClients) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getAllUsers(): Observable<any> {
    const usersClient = this.microserviceClients.getUsersClient();
    return usersClient.send('getAllUsers', {});
  }

  @Get('profile')
  @UseGuards(CustomJwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token',
  })
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
  }
}
