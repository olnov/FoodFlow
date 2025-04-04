import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog.dto';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  const sampleItem = {
    _id: 'catalog123',
    name: 'Oranges',
    description: 'Oranges from Spaint',
    imageUrl: 'http://image.url/oranges.jpg',
    isActive: true,
  };

  const mockCatalogService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a catalog item', async () => {
      const dto: CreateCatalogItemDto = {
        name: 'Oranges',
        description: 'Oranges from Spain',
        unit: 'kg',
        imageUrl: 'http://image.url/tomatoes.jpg',
        isActive: true,
      };

      mockCatalogService.create.mockResolvedValue(sampleItem);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(sampleItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of catalog items', async () => {
      mockCatalogService.findAll.mockResolvedValue([sampleItem]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([sampleItem]);
    });
  });

  describe('findOne', () => {
    it('should return a single catalog item by id', async () => {
      mockCatalogService.findById.mockResolvedValue(sampleItem);

      const result = await controller.findOne('catalog123');
      expect(service.findById).toHaveBeenCalledWith('catalog123');
      expect(result).toEqual(sampleItem);
    });
  });
});
