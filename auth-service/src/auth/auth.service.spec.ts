import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/togin.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let userService: Partial<UsersService>;
  const mockUser = {
    id: '123',
    email: 'test@test.com',
    password: 'password',
    role: 'user',
  };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: RefreshTokenService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return userdata if credentials are valid', async () => {
    const loginDto: LoginDto = {
      email: mockUser.email,
      password: mockUser.password,
    };

    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.validateUser(loginDto);
    expect(result).toEqual({
      id: '123',
      email: 'test@test.com',
      role: 'user',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('should return null if user not found', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    const result = await service.validateUser({
      email: 'notexistinguser@example.com',
      password: 'password',
    });
    expect(result).toEqual(null);
  });
});
