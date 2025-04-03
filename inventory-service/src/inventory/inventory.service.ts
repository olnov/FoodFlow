import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryItem } from './schemas/inventory-item.schema';
import { Model } from 'mongoose';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryItemModel: Model<InventoryItem>,
  ) {}

  async create(inventoryItemDto: CreateInventoryItemDto) {
    return await this.inventoryItemModel.create(inventoryItemDto);
  }

  async findAll() {
    return await this.inventoryItemModel.find().exec();
  }
}
