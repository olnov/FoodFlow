import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// User's authentication
type JwtPayloadUser = {
  sub: string;
  email: string;
  role: string;
};

// M2M authentication
type JwtPayloadMachine = {
  sub: string;
  scopes: string[];
};

type JwtPayload = JwtPayloadUser | JwtPayloadMachine;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    if ('email' in payload) {
      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } else {
      return {
        userId: payload.sub,
        scopes: payload.scopes,
      };
    }
  }
}
