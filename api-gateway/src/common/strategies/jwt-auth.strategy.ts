import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../auth/token.service';
import { TokenType } from '@eventure/shared-lib';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JWT-auth') {
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
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const tokenValidation = await this.tokenService.validateToken(
      token,
      TokenType.ACCESS,
    );

    if (!tokenValidation) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { user } = tokenValidation;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
