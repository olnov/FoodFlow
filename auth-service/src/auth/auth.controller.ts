import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from '../clients/clients.service';
import { M2MTokenDto } from './dto/m2m-token.dto';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly clientService: ClientsService,
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

  @Post('m2m-token')
  async getM2MToken(@Body() m2mTokenDto: M2MTokenDto) {
    const { clientId, clientSecret } = m2mTokenDto;
    const client = await this.clientService.validate(clientId, clientSecret);
    if (!client)
      throw new UnauthorizedException('Invalid or expired client credentials');

    const payload = {
      clientId: client.clientId,
      scope: client.scopes,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    return { accessToken: token };
  }

  @Get('ping')
  ping() {
    return { status: 'auth-service is alive' };
  }
}
