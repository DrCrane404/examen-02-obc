import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/auth.controller';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('categorias')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiBody({type:CreateCategoryDto})
  @ApiCreatedResponse({type:Category, description:"Categoria correctamente creada"})
  @ApiBadRequestResponse({description:"Cuando falta un campo, o el formato es incorrecto "})
  @ApiForbiddenResponse({description:'Solo el rol de developer y admin pueden crear categorias'})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({description:'Solo el rol de developer y admin pueden modificar categorias'})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({description:'Solo el rol de admin puede eliminar categorias'})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
