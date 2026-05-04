import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Category } from '../categories/entities/category.entity';
import { Option } from '../options/entities/option.entity';

@Injectable()
export class ProductoService {
  constructor(
  @InjectRepository(Producto)
  private productoRepo: Repository<Producto>,

  @InjectRepository(Category)
  private categoryRepo: Repository<Category>,

  @InjectRepository(Option)
  private optionRepo: Repository<Option>,
  ){}

  async create(dto: CreateProductoDto) {
    const categories = await this.categoryRepo.findBy({
      id: In(dto.categories)
    });

    let options: Option[] = [];
    if (dto.options && dto.options.length > 0){
      options = await this.optionRepo.findBy({
        id: In(dto.options),
      });
    }

    const producto = this.productoRepo.create({
      ...dto,
      create_date:new Date (dto.create_date),
      categories,
      options,
    });

    return await this.productoRepo.save(producto);
  }

  async findAll() {
    return await this.productoRepo.find()
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOneBy({id});
    if(!producto){
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto) {
    //Buscar el producto
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['categories', 'options'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    //Buscar nuevas relaciones
    let categories = producto.categories;
    if (dto.categories) {
      categories = await this.categoryRepo.findBy({
        id: In(dto.categories),
      });
    }
    let options = producto.options;
    if (dto.options) {
      options = await this.optionRepo.findBy({
        id: In(dto.options),
      });
    }
    //remplazar datos nuevos
    Object.assign(producto, {
      ...dto,
      create_date: dto.create_date
        ? new Date(dto.create_date)
        : producto.create_date,
      categories,
      options,
    });
    return await this.productoRepo.save(producto);
  }

  async remove(id: number) {
    const producto = await this.productoRepo.findOne({
      where: { id },
      relations: ['categories', 'options'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return await this.productoRepo.remove(producto);
  }
}
