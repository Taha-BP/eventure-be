import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  User,
  Token,
  TokenType,
} from '@eventure/shared-lib';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async createToken(
    userId: string,
    token: string,
    type: TokenType = TokenType.ACCESS,
  ): Promise<Token> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
    const expiresAt = new Date();

    // Parse expiresIn (e.g., '24h', '7d', '30m')
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      default:
        expiresAt.setHours(expiresAt.getHours() + 24); // Default to 24 hours
    }

    const tokenEntity = this.tokenRepository.create({
      token,
      type,
      userId,
      expiresAt,
      isActive: true,
    });

    return this.tokenRepository.save(tokenEntity);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, name, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new RpcException({
        code: 400,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
    };
    const token = this.jwtService.sign(payload);

    // Create token entry in database
    await this.createToken(savedUser.id, token, TokenType.ACCESS);

    return {
      token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new RpcException({
        code: 404,
        message: 'User not found with this email address',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({
        code: 401,
        message: 'Incorrect password',
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwtService.sign(payload);

    // Create token entry in database
    await this.createToken(user.id, token, TokenType.ACCESS);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
