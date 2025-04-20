import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogItem } from './schemas/catalog-item.schema';
import { Model } from 'mongoose';
import { CreateCatalogItemDto } from './dto/create-catalog.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(CatalogItem.name) private catalogModel: Model<CatalogItem>,
  ) {}

  async findAll(search?: string): Promise<CatalogItem[]> {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    return this.catalogModel.find(query).exec();
  }

  async findById(id: string) {
    return this.catalogModel.findById(id).exec();
  }

  async create(catalogItemDto: CreateCatalogItemDto) {
    return this.catalogModel.create(catalogItemDto);
  }

  async update(id: string, catalogItemDto: Partial<UpdateCatalogItemDto>) {
    const result = await this.catalogModel
      .findByIdAndUpdate(id, catalogItemDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!result) {
      throw new NotFoundException('Catalog item not found');
    }
    return result;
  }

  async delete(id: string) {
    const result = await this.catalogModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Catalog items not found');
    }
  }
}
