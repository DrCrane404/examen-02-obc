import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/auth.controller';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Options')
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CreateOptionDto })
  @ApiCreatedResponse({ 
    description: 'Opción creada correctamente',
    schema: { example: { id: 1, option_name: 'Color' } }
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @ApiForbiddenResponse({ description: 'Solo roles admin o developer pueden crear opciones' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Post()
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @ApiOkResponse({ 
    description: 'Lista de todas las opciones',
    schema: { example: [{ id: 1, option_name: 'Color', products: [{ id: 1, name: 'Laptop Gamer' }] }] }
  })
  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  @ApiOkResponse({ 
    description: 'Opción encontrada',
    schema: { example: { id: 1, option_name: 'Color', products: [{ id: 1, name: 'Laptop Gamer' }] } }
  })
  @ApiNotFoundResponse({ description: 'Opción no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateOptionDto })
  @ApiOkResponse({ 
    description: 'Opción actualizada correctamente',
    schema: { example: { id: 1, option_name: 'Talla' } }
  })
  @ApiNotFoundResponse({ description: 'Opción no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @ApiForbiddenResponse({ description: 'Solo roles admin o developer pueden actualizar opciones' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(+id, updateOptionDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: 'Opción eliminada correctamente',
    schema: { example: { id: 1, option_name: 'Color' } }
  })
  @ApiNotFoundResponse({ description: 'Opción no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @ApiForbiddenResponse({ description: 'Solo el rol admin puede eliminar opciones' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(+id);
  }
  
}
