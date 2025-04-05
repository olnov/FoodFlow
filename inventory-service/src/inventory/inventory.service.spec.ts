import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getModelToken } from '@nestjs/mongoose';
import { InventoryItem } from './schemas/inventory-item.schema';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let mockInventoryModel: any;
  let mockHttpService: { get: jest.Mock; post: jest.Mock };
  let mockFind: jest.Mock;

  const sampleItem: CreateInventoryItemDto = {
    catalogItemId: 'oranges455',
    quantity: 100,
    price: 2.99,
  };

  beforeEach(async () => {
    const mockSave = jest.fn();
    mockFind = jest.fn();

    mockInventoryModel = Object.assign(
      jest.fn().mockImplementation((data) => ({
        ...data,
        save: mockSave.mockResolvedValue({ _id: 'test-id', ...data }),
      })),
      {
        find: mockFind,
      },
    );

    mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          M2M_CLIENT_ID: 'inventory-service',
          M2M_CLIENT_SECRET: 'secret',
          AUTH_SERVICE_URL: 'http://auth-service',
          CATALOG_SERVICE_URL: 'http://catalog-service',
        };
        return values[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getModelToken(InventoryItem.name),
          useValue: mockInventoryModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new inventory item if catalog item is valid', async () => {
      mockHttpService.post.mockReturnValue(
        of({ data: { accessToken: 'mock-token' } }),
      );
      mockHttpService.get.mockReturnValue(
        of({ data: { id: 'oranges455', name: 'Oranges' } }),
      );

      const result = await service.create(sampleItem);

      expect(mockHttpService.post).toHaveBeenCalled();
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://catalog-service/catalog/oranges455',
        { headers: { Authorization: 'Bearer mock-token' } },
      );
      expect(result).toHaveProperty('catalogItemId', sampleItem.catalogItemId);
      expect(result).toHaveProperty('price', sampleItem.price);
    });

    it('should throw NotFoundException if catalog item does not exist', async () => {
      mockHttpService.post.mockReturnValue(
        of({ data: { accessToken: 'mock-token' } }),
      );
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Not found')),
      );

      await expect(service.create(sampleItem)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of inventory items', async () => {
      const items = [sampleItem];

      mockFind.mockReturnValue({
        exec: jest.fn().mockResolvedValue(items),
      });

      const result = await service.findAll();

      expect(mockInventoryModel.find).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });
});
