import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'Catalog item id' })
  @IsString()
  @IsNotEmpty()
  catalogItemId: string;

  @ApiProperty({ description: 'Items quantity', example: '10' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Item price', example: '100' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
