import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getModelToken } from '@nestjs/mongoose';
import { InventoryItem } from './schemas/inventory-item.schema';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';

describe('InventoryService', () => {
  let service: InventoryService;
  let model: {
    create: jest.Mock;
    find: jest.Mock;
  };

  const sampleItem: CreateInventoryItemDto = {
    name: 'Oranges',
    description: 'Oranges from Spain',
    quantity: 100,
    price: 2.99,
    unit: 'kg',
  };

  beforeEach(async () => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getModelToken(InventoryItem.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new inventory item', async () => {
      model.create.mockResolvedValue(sampleItem);

      const result = await service.create(sampleItem);

      expect(model.create).toHaveBeenCalledWith(sampleItem);
      expect(result).toEqual(sampleItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of inventory items', async () => {
      const items = [sampleItem];
      model.find().exec = jest.fn().mockResolvedValue(items);

      const result = await service.findAll();

      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });
});
