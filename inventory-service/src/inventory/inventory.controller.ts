import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll() {
    return await this.inventoryService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return await this.inventoryService.create(createInventoryItemDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() item: UpdateInventoryDto) {
    return await this.inventoryService.update(id, item);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.inventoryService.delete(id);
  }
}
