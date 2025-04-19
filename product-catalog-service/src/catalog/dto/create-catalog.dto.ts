import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogItemDto {
  @ApiProperty({ description: 'Item name', example: 'Apples' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Item description',
    example: 'Apples from Poland',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Unit', example: 'kg' })
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'Item image url',
    example: 'https://somes3service.com/bucket/img-000.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Is item available', example: 'true or false' })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
