import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { Option } from './entities/option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Option])
    ],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
