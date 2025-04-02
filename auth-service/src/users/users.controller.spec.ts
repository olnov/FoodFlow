import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: 'password',
      role: 'user',
    };

    const createdUser = {
      id: '12445',
      email: 'test@test.com',
      role: 'user',
      createdAt: Date.now(),
      upDatedAt: null,
    };

    jest.spyOn(mockUsersService, 'create').mockResolvedValue(createdUser);
    const result = await controller.create(createUserDto);
    expect(result).toEqual(createdUser);
  });

  it('should return a user data, if users is present in the db', async () => {
    const foundUser = {
      id: '12445',
      email: 'test@test.com',
      role: 'user',
      createdAt: Date.now(),
      upDatedAt: null,
    };

    jest.spyOn(mockUsersService, 'findByEmail').mockResolvedValue(foundUser);

    const result = await controller.findByEmail('test@test.com');
    expect(result).toEqual(foundUser);
  });

  it('should return null if user is not in the db', async () => {
    jest.spyOn(mockUsersService, 'findByEmail').mockResolvedValue(null);
    const result = await controller.findByEmail('nonexising@email.com');
    expect(result).toEqual(null);
  });
});
