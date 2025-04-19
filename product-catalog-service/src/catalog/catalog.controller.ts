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
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UpdateCatalogItemDto } from './dto/update-catalog.dto';

@UseGuards(JwtAuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiCreatedResponse({ description: 'Catalog items successfully created' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async create(@Body() createCatalogItemDto: CreateCatalogItemDto) {
    console.log('Creating catalog item: ', createCatalogItemDto);
    return await this.catalogService.create(createCatalogItemDto);
  }

  @ApiOkResponse({ description: 'Catalog items successfully retrieved' })
  @ApiBearerAuth('JWT-auth')
  @Get()
  async findAll() {
    return await this.catalogService.findAll();
  }

  @ApiOkResponse({ description: 'Catalog item successfully retrieved' })
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.catalogService.findById(id);
  }

  @ApiOkResponse({ description: 'Catalog item successfully updated' })
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() catalogItem: UpdateCatalogItemDto,
  ) {
    return await this.catalogService.update(id, catalogItem);
  }

  @ApiOkResponse({ description: 'Catalog item deleted' })
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.catalogService.delete(id);
  }
}
