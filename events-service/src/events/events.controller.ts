import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern('createEvent')
  async createEvent(
    @Payload()
    createEventDto: {
      title: string;
      description: string;
      media: string;
      creatorId: string;
    },
  ) {
    return this.eventsService.createEvent(createEventDto);
  }

  @MessagePattern('acknowledgeEvent')
  async acknowledgeEvent(@Payload() data: { eventId: string; userId: string }) {
    return this.eventsService.acknowledgeEvent(data.eventId, data.userId);
  }

  @MessagePattern('getEventById')
  async getEventById(@Payload() data: { eventId: string }) {
    return this.eventsService.getEventById(data.eventId);
  }

  @MessagePattern('getEventAcknowledgments')
  async getEventAcknowledgments(@Payload() data: { eventId: string }) {
    return this.eventsService.getEventAcknowledgments(data.eventId);
  }
}
