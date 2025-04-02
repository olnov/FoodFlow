import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'admin',
  };

  const findOneMock = jest.fn();

  // This will be used as the constructor for new this.userModel({...})
  const save = jest.fn();
  const mockUserModelConstructor = jest.fn().mockImplementation(() => ({
    save,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: Object.assign(mockUserModelConstructor, {
            findOne: findOneMock,
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const foundUser = { ...mockUser };

      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundUser),
      });

      const result = await service.findByEmail(mockUser.email);

      expect(findOneMock).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(foundUser);
    });
  });

  describe('create', () => {
    it('should hash password and save new user', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'plaintext123',
        role: 'user',
      };

      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockSalt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      save.mockResolvedValue({
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      });

      const result = await service.create(dto);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 'mockSalt');

      expect(mockUserModelConstructor).toHaveBeenCalledWith({
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      });

      expect(save).toHaveBeenCalled();
      expect(result).toEqual({
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      });
    });
  });
});
