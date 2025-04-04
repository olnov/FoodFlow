import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogItem } from './schemas/catalog-item.schema';
import { Model } from 'mongoose';
import { CreateCatalogItemDto } from './dto/create-catalog.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(CatalogItem.name) private catalogModel: Model<CatalogItem>,
  ) {}

  async findAll() {
    return this.catalogModel.find().exec();
  }

  async findById(id: string) {
    return this.catalogModel.findById(id).exec();
  }

  async create(catalogItemDto: CreateCatalogItemDto) {
    return this.catalogModel.create(catalogItemDto);
  }
}
