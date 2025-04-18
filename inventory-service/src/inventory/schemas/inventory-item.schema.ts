import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryItem extends Document {
  @Prop({ required: true })
  catalogItemId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
