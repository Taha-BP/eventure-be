import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { Observable } from 'rxjs';

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
}
