import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';
import { getModelToken } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let model: any;

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: getModelToken(RefreshToken.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
    model = module.get(getModelToken(RefreshToken.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new refresh token', async () => {
      const userId = 'user123';
      const token = 'refresh.token.value';
      const expiresIn = 3600;

      const expectedResult = { userId, token, expiresAt: new Date() };
      mockModel.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, token, expiresIn);

      expect(mockModel.create).toHaveBeenCalledWith({
        userId,
        token,
        expiresAt: expect.any(Date),
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByToken', () => {
    it('should find a token by value', async () => {
      const token = 'sample.token';
      const mockDoc = { userId: 'user1', token };

      mockModel.findOne.mockResolvedValue(mockDoc);

      const result = await service.findByToken(token);

      expect(mockModel.findOne).toHaveBeenCalledWith({ token });
      expect(result).toEqual(mockDoc);
    });
  });

  describe('remove', () => {
    it('should remove a token by value', async () => {
      const token = 'token.to.remove';
      mockModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.remove(token);

      expect(mockModel.deleteOne).toHaveBeenCalledWith({ token });
      expect(result).toEqual({ deletedCount: 1 });
    });
  });

  describe('removeAllForUser', () => {
    it('should remove all tokens for a user', async () => {
      const userId = 'user123';
      mockModel.deleteMany.mockResolvedValue({ deletedCount: 3 });

      const result = await service.removeAllForUser(userId);

      expect(mockModel.deleteMany).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({ deletedCount: 3 });
    });
  });
});
