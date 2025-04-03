import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let refreshTokenService: RefreshTokenService;
  let jwtService: JwtService;
  let clientService: ClientsService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockRefreshTokenService = {
    findByToken: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockClientService = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ClientsService, useValue: mockClientService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    jwtService = module.get<JwtService>(JwtService);
    clientService = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.login and return tokens', async () => {
      const loginDto = { email: 'test@example.com', password: 'password!1' };
      const mockTokens = {
        accessToken: 'access.token.here',
        refreshToken: 'refresh.token.here',
      };

      (authService.login as jest.Mock).mockResolvedValue(mockTokens);

      const result = await controller.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refresh', () => {
    it('should issue new access token if refresh token is valid', async () => {
      const token = 'refresh.token.here';
      const payload = {
        userId: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (refreshTokenService.findByToken as jest.Mock).mockResolvedValue({
        token,
      });
      (jwtService.verify as jest.Mock).mockReturnValue(payload);
      (jwtService.sign as jest.Mock).mockReturnValue('new.access.token');

      const result = await controller.refresh(token);

      expect(refreshTokenService.findByToken).toHaveBeenCalledWith(token);
      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ accessToken: 'new.access.token' });
    });

    it('should throw Unauthorized if refresh token is not found', async () => {
      (refreshTokenService.findByToken as jest.Mock).mockResolvedValue(null);

      await expect(controller.refresh('bad.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw Unauthorized if refresh token is invalid', async () => {
      (refreshTokenService.findByToken as jest.Mock).mockResolvedValue({
        token: 'bad.token',
      });
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token error');
      });

      await expect(controller.refresh('bad.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should call refreshTokenService.remove()', async () => {
      const token = 'refresh.token.here';

      await controller.logout(token);

      expect(refreshTokenService.remove).toHaveBeenCalledWith(token);
    });
  });

  describe('m2m-token', () => {
    it('should return accessToken for m2m communications', async () => {
      const token = {
        accessToken: 'new.access.token',
      };

      const payload = {
        userId: '123',
        clientSecret: 'mySecret',
      };

      (clientService.validate as jest.Mock).mockResolvedValue(token);

      const result = await controller.getM2MToken(
        payload.userId,
        payload.clientSecret,
      );
      expect(result).toEqual(token);
    });
  });
});
