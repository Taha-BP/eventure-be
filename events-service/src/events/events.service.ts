import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EventResponse,
  AcknowledgeEventResponse,
  Event,
  EventAcknowledgment,
  User,
} from '@eventure/shared-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventAcknowledgment)
    private readonly acknowledgmentRepository: Repository<EventAcknowledgment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEvent(createEventDto: {
    title: string;
    description: string;
    media: string;
    creatorId: string;
  }): Promise<EventResponse> {
    const { title, description, media, creatorId } = createEventDto;

    // Verify creator exists
    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Save media file
    const mediaPath = this.saveMediaFile(media, creatorId);

    // Create event
    const event = this.eventRepository.create({
      title,
      description,
      mediaPath,
      creatorId,
    });

    const savedEvent = await this.eventRepository.save(event);

    return {
      id: savedEvent.id,
      title: savedEvent.title,
      description: savedEvent.description,
      mediaPath: savedEvent.mediaPath || null,
      creatorId: savedEvent.creatorId,
      creator: {
        id: creator.id,
        name: creator.name,
      },
      createdAt: savedEvent.createdAt,
      updatedAt: savedEvent.updatedAt,
    };
  }

  async acknowledgeEvent(
    eventId: string,
    userId: string,
  ): Promise<AcknowledgeEventResponse> {
    // Find event
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already acknowledged
    const existingAcknowledgment = await this.acknowledgmentRepository.findOne({
      where: { eventId, userId },
    });

    if (existingAcknowledgment) {
      throw new BadRequestException('Event already acknowledged');
    }

    // Get acknowledgment order
    const eventAcknowledgments = await this.acknowledgmentRepository.find({
      where: { eventId },
      order: { order: 'ASC' },
    });
    const order = eventAcknowledgments.length + 1;

    // Calculate points (1st = 100, 2nd = 90, 3rd = 80, etc.)
    const pointsEarned = Math.max(100 - (order - 1) * 10, 10);

    // Create acknowledgment
    const acknowledgment = this.acknowledgmentRepository.create({
      eventId,
      userId,
      pointsEarned,
      order,
    });

    await this.acknowledgmentRepository.save(acknowledgment);

    return {
      message: 'Event acknowledged',
      pointsEarned,
    };
  }

  async getEventById(eventId: string): Promise<EventResponse | null> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) return null;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      mediaPath: event.mediaPath || null,
      creatorId: event.creatorId,
      creator: {
        id: event.creator.id,
        name: event.creator.name,
      },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  async getEventAcknowledgments(
    eventId: string,
  ): Promise<EventAcknowledgment[]> {
    return await this.acknowledgmentRepository.find({
      where: { eventId },
      order: { order: 'ASC' },
      relations: ['user'],
    });
  }

  private saveMediaFile(mediaBase64: string, creatorId: string): string {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate filename
    const filename = `${creatorId}_${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    const buffer = Buffer.from(mediaBase64, 'base64');
    fs.writeFileSync(filePath, buffer);

    return filePath;
  }
}
