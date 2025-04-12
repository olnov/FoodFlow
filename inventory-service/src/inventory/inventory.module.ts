import { Module } from '@nestjs/common';
import {
  InventoryItem,
  InventoryItemSchema,
} from './schemas/inventory-item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryItem.name, schema: InventoryItemSchema },
    ]),
    HttpModule,
    ConfigModule,
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
