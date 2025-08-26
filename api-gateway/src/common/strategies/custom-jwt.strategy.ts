import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../auth/token.service';
import { TokenType } from '@eventure/shared-lib';

@Injectable()
export class CustomJwtStrategy extends PassportStrategy(
  Strategy,
  'custom-jwt',
) {
  constructor(
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'fallback-secret',
      passReqToCallback: true,
    });
  }

  async validate(request: any) {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    // Validate token against database
    const tokenValidation = await this.tokenService.validateToken(
      token,
      TokenType.ACCESS,
    );

    if (!tokenValidation) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { user } = tokenValidation;

    // Check if user exists and is active
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user information
    return user;
  }
}
