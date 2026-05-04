import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Producto } from './entities/producto.entity';
import { Option } from '../options/entities/option.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([Producto , Category, Option])
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
