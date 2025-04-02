import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { jwtConfig } from './config/jwt.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig),
    PassportModule,
    RefreshTokenModule,
  ],
})
export class AuthModule {}
