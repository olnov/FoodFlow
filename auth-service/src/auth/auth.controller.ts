import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/togin.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'login' })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('ping')
  ping() {
    return { status: 'auth-service is alive' };
  }
}
