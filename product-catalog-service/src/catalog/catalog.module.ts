import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogItem, CatalogItemSchema } from './schemas/catalog-item.schema';
import { CatalogController } from './catalog.controller';

@Module({
  providers: [CatalogService],
  imports: [
    MongooseModule.forFeature([
      { name: CatalogItem.name, schema: CatalogItemSchema },
    ]),
  ],
  controllers: [CatalogController],
})
export class CatalogModule {}
