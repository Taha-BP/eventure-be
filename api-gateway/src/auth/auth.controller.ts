import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MicroserviceClients } from '../common/clients/microservice-clients';
import { RegisterDto, LoginDto, AuthResponse } from '@eventure/shared-lib';
import { Observable } from 'rxjs';
import { Public } from '../common/decorators/public.decorator';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly microserviceClients: MicroserviceClients,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @Public()
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
  @Public()
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token',
  })
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    await this.tokenService.deactivateToken(token);

    return { message: 'Logged out successfully' };
  }
}
