import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { getModelToken } from '@nestjs/mongoose';
import { CatalogItem } from './schemas/catalog-item.schema';

describe('CatalogService', () => {
  let service: CatalogService;
  let model: {
    create: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
  };

  const sampleItem = {
    _id: 'catalog123',
    name: 'Oranges',
    description: 'Oranges from Spain',
    unit: 'kg',
    imageUrl: 'http://image.url/oranges.jpg',
    isActive: true,
  };

  beforeEach(async () => {
    model = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getModelToken(CatalogItem.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  afterEach(async () => {
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

  describe('findById', () => {
    it('should return an array of inventory items', async () => {
      const item = sampleItem;
      model.findById(sampleItem._id).exec = jest.fn().mockResolvedValue(item);

      const result = await service.findById(sampleItem._id);

      expect(model.findById).toHaveBeenCalled();
      expect(result).toEqual(item);
    });
  });

});
