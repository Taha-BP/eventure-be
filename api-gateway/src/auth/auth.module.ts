import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token, User } from '@eventure/shared-lib';
import { TokenService } from './token.service';
import { CustomJwtStrategy } from '../common/strategies/custom-jwt.strategy';
import { CustomJwtAuthGuard } from '../common/guards/custom-jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService, CustomJwtStrategy, CustomJwtAuthGuard],
  exports: [TokenService, CustomJwtAuthGuard, JwtModule],
})
export class AuthModule {}
