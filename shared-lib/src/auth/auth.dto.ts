import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User full name",
    example: "John Doe",
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
    minLength: 6,
    type: String,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
    type: String,
  })
  @IsString()
  password: string;
}

export class AuthResponse {
  @ApiProperty({
    description: "JWT authentication token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: String,
  })
  token: string;

  @ApiProperty({
    description: "User information",
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "123e4567-e89b-12d3-a456-426614174000",
        description: "Unique user identifier",
      },
      email: {
        type: "string",
        example: "john.doe@example.com",
        description: "User email address",
      },
      name: {
        type: "string",
        example: "John Doe",
        description: "User full name",
      },
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
  };
}
