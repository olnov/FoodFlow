import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/togin.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const storedToken =
      await this.refreshTokenService.findByToken(refreshToken);
    if (!storedToken) throw new UnauthorizedException();

    try {
      const payload: { userId: string; email: string; role: string } =
        this.jwtService.verify(refreshToken);

      const newAccessToken = this.jwtService.sign({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired access token:' + error,
      );
    }
  }

  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.refreshTokenService.remove(refreshToken);
  }

  @Get('ping')
  ping() {
    return { status: 'auth-service is alive' };
  }
}
