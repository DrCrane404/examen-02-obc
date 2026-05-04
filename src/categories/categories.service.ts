import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private categoryRepo : Repository<Category>){}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find({
      relations: ['products'],
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    Object.assign(category, updateCategoryDto);
    const updated = await this.categoryRepo.save(category);

    // Excluimos los productos de la respuesta si no los necesitas
    const { products, ...result } = updated;
    return result;

  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({where:{id}});

    if (!category){
      throw new NotFoundException('Categoria no encontrada');
    }
    await this.categoryRepo.remove(category);

    return {id, name: category.name};
  }
}
