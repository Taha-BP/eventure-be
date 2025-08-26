import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token, TokenType, User } from '@eventure/shared-lib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async createToken(
    userId: string,
    token: string,
    type: TokenType = TokenType.ACCESS,
  ): Promise<Token> {
    const expiresIn = this.configService.get<string>('jwt.expiresIn') || '24h';
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

  async validateToken(
    token: string,
    type: TokenType = TokenType.ACCESS,
  ): Promise<{ user: User; token: Token } | null> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: {
        token,
        type,
        isActive: true,
      },
      relations: ['user'],
    });

    if (!tokenEntity) {
      return null;
    }

    // Check if token is expired
    if (new Date() > tokenEntity.expiresAt) {
      // Mark token as inactive
      await this.tokenRepository.update(tokenEntity.id, { isActive: false });
      return null;
    }

    return {
      user: tokenEntity.user,
      token: tokenEntity,
    };
  }

  async deactivateToken(token: string): Promise<void> {
    await this.tokenRepository.update({ token }, { isActive: false });
  }

  async deactivateUserTokens(userId: string, type?: TokenType): Promise<void> {
    const whereClause: any = { userId, isActive: true };
    if (type) {
      whereClause.type = type;
    }

    await this.tokenRepository.update(whereClause, { isActive: false });
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.update(
      { expiresAt: new Date(), isActive: true },
      { isActive: false },
    );
  }
}
