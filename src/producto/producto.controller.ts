import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Roles } from '../auth/auth.controller';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('producto')
export class ProductoController {
  constructor(private productoService: ProductoService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CreateProductoDto })
  @ApiCreatedResponse({ description: 'Producto creado correctamente' })
  @ApiForbiddenResponse({ description: 'Solo roles admin o developer pueden crear productos' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @ApiOkResponse({ description: 'Lista de todos los productos' })
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @ApiOkResponse({ description: 'Producto encontrado' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateProductoDto })
  @ApiOkResponse({ description: 'Producto actualizado correctamente' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @ApiForbiddenResponse({ description: 'Solo roles admin o developer pueden actualizar productos' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Producto eliminado correctamente' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @ApiForbiddenResponse({ description: 'Solo el rol admin puede eliminar productos' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
