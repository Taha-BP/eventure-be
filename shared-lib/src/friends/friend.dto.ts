import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddFriendDto {
  @ApiProperty({
    description: "Friend user ID (either friendId or email is required)",
    example: "user-456",
    required: false,
    type: String,
  })
  @IsString()
  friendId?: string;

  @ApiProperty({
    description: "Friend email address (either friendId or email is required)",
    example: "jane.smith@example.com",
    required: false,
    type: String,
  })
  @IsEmail()
  email?: string;
}

export class FriendResponse {
  @ApiProperty({
    description: "Friendship record ID",
    example: "friendship-123",
    type: String,
  })
  id: string;

  @ApiProperty({
    description: "Current user ID",
    example: "user-123",
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: "Friend user ID",
    example: "user-456",
    type: String,
  })
  friendId: string;

  @ApiProperty({
    description: "Friend user information",
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "user-456",
        description: "Friend user ID",
      },
      name: {
        type: "string",
        example: "Jane Smith",
        description: "Friend full name",
      },
      email: {
        type: "string",
        example: "jane.smith@example.com",
        description: "Friend email address",
      },
    },
  })
  friend: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: "Friendship creation date",
    example: "2024-01-15T10:30:00.000Z",
    type: Date,
  })
  createdAt: Date;
}
