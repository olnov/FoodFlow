import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(createCatalogItemDto: CreateCatalogItemDto) {
    return await this.catalogService.create(createCatalogItemDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll() {
    return await this.catalogService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.catalogService.findById(id);
  }
}
