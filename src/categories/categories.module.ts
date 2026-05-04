import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { Producto } from '../producto/entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto , Category])
    ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
