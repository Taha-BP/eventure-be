import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({
    description: "Event title",
    example: "Birthday Party",
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Event description (optional)",
    example: "Join us for a fun birthday celebration!",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Base64 encoded media file (JPG, PNG, or MP4)",
    example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    type: String,
  })
  @IsString()
  media: string; // Base64 encoded media
}

export class EventResponse {
  @ApiProperty({
    description: "Event ID",
    example: "event-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Event title",
    example: "Birthday Party",
    type: String,
  })
  title: string;

  @ApiProperty({
    description: "Event description",
    example: "Join us for a fun birthday celebration!",
    required: false,
    type: String,
  })
  description?: string;

  @ApiProperty({
    description: "Path to stored media file",
    example: "/uploads/event-123-image.jpg",
    type: String,
  })
  mediaPath: string;

  @ApiProperty({
    description: "Event creator user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: String,
  })
  creatorId: string;

  @ApiProperty({
    description: "Event creator information",
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Creator user ID",
      },
      name: {
        type: "string",
        example: "John Doe",
        description: "Creator full name",
      },
    },
  })
  creator: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: "Event creation date",
    example: "2024-01-15T10:30:00.000Z",
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: "Event last update date",
    example: "2024-01-15T10:30:00.000Z",
    type: Date,
  })
  updatedAt: Date;
}

export class AcknowledgeEventResponse {
  @ApiProperty({
    description: "Success message",
    example: "Event acknowledged successfully",
    type: String,
  })
  message: string;

  @ApiProperty({
    description: "Points earned for acknowledging the event",
    example: 100,
    type: Number,
  })
  pointsEarned: number;
}
