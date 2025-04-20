import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventoryItem } from './schemas/inventory-item.schema';
import { Model } from 'mongoose';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private readonly inventoryItemModel: Model<InventoryItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(inventoryItemDto: CreateInventoryItemDto) {
    await this.checkCatalogItem(inventoryItemDto.catalogItemId);

    const inventory = new this.inventoryItemModel({
      catalogItemId: inventoryItemDto.catalogItemId,
      quantity: inventoryItemDto.quantity,
      price: inventoryItemDto.price,
    });

    return inventory.save();
  }

  async findAll() {
    return await this.inventoryItemModel.find().exec();
  }

  async update(
    id: string,
    updateInventoryItemDto: Partial<UpdateInventoryDto>,
  ) {
    return this.inventoryItemModel.findByIdAndUpdate(
      id,
      updateInventoryItemDto,
    );
  }

  async delete(id: string) {
    const result = await this.inventoryItemModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Inventory item not found');
    }
  }

  private async checkCatalogItem(catalogItemId: string) {
    const token = await this.getM2mToken();

    try {
      await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('CATALOG_SERVICE_URL')}/catalog/${catalogItemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new NotFoundException(
        `Catalog item "${catalogItemId}" not found. Error: ${message}`,
      );
    }
  }

  private async getM2mToken(): Promise<string> {
    const body: {
      clientId: string | undefined;
      clientSecret: string | undefined;
    } = {
      clientId: this.configService.get<string>('INV_M2M_ID'),
      clientSecret: this.configService.get<string>('INV_M2M_SECRET'),
    };

    const res = await firstValueFrom(
      this.httpService.post<{ accessToken: string }>(
        `${this.configService.get('AUTH_SERVICE_URL')}/m2m-token`,
        body,
      ),
    );
    return res.data.accessToken;
  }
}
