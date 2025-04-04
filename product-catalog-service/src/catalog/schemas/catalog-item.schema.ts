import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CatalogItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  unit: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const CatalogItemSchema = SchemaFactory.createForClass(CatalogItem);
