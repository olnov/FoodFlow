import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const sampleItem: CreateInventoryItemDto = {
    name: 'Oranges',
    description: 'Oranges from Spain',
    quantity: 100,
    price: 2.99,
    unit: 'kg',
  };

  const mockInventoryService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of inventory items', async () => {
      const items = [sampleItem];
      mockInventoryService.findAll.mockResolvedValue(items);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });

  describe('create', () => {
    it('should create and return a new inventory item', async () => {
      mockInventoryService.create.mockResolvedValue(sampleItem);

      const result = await controller.create(sampleItem);
      expect(service.create).toHaveBeenCalledWith(sampleItem);
      expect(result).toEqual(sampleItem);
    });
  });
});
