import {
  IsEmail,
  IsUUID,
  ValidateIf,
  Validate,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RequireAtLeastOne } from "../common/decorators";

@RequireAtLeastOne(
  ["friendId", "email"],
  "Either friendId or email is required"
)
export class AddFriendDto {
  @ApiProperty({
    description: "Friend user ID (either friendId or email is required)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsUUID(undefined, { message: "friendId must be a valid UUID" })
  friendId?: string;

  @ApiProperty({
    description: "Friend email address (either friendId or email is required)",
    example: "jane.smith@example.com",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEmail({}, { message: "email must be a valid email address" })
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
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: String,
  })
  userId: string;

  @ApiProperty({
    description: "Friend user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: String,
  })
  friendId: string;

  @ApiProperty({
    description: "Friend user information",
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "123e4567-e89b-12d3-a456-426614174000",
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
