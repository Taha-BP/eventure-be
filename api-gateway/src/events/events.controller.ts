import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  CreateEventDto,
  EventResponse,
  AcknowledgeEventResponse,
} from '@eventure/shared-lib';
import { Observable } from 'rxjs';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class EventsController {
  constructor(private readonly microserviceClients: MicroserviceClients) {}

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @Request() req: RequestWithUser,
  ): Observable<EventResponse> {
    const eventsClient = this.microserviceClients.getEventsClient();
    return eventsClient.send<EventResponse>('createEvent', {
      ...createEventDto,
      creatorId: req.user.userId,
    });
  }

  @Post(':id/open')
  @ApiOperation({ summary: 'Acknowledge an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({
    status: 200,
    description: 'Event acknowledged successfully',
    type: AcknowledgeEventResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - event not found or already acknowledged',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  acknowledgeEvent(
    @Param('id') eventId: string,
    @Request() req: RequestWithUser,
  ): Observable<AcknowledgeEventResponse> {
    const eventsClient = this.microserviceClients.getEventsClient();
    return eventsClient.send<AcknowledgeEventResponse>('acknowledgeEvent', {
      eventId,
      userId: req.user.userId,
    });
  }
}
