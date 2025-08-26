import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { RegisterDto, LoginDto, AuthResponse } from '@eventure/shared-lib';
import { Observable } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly microserviceClients: MicroserviceClients) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with this email already exists',
  })
  register(@Body() registerDto: RegisterDto): Observable<AuthResponse> {
    const authClient = this.microserviceClients.getAuthClient();
    return authClient.send<AuthResponse>('register', registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  login(@Body() loginDto: LoginDto): Observable<AuthResponse> {
    const authClient = this.microserviceClients.getAuthClient();
    return authClient.send<AuthResponse>('login', loginDto);
  }
}
