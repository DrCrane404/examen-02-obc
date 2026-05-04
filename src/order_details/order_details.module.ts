import { Module } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { OrderDetailsController } from './order_details.controller';
import { OrderDetail } from './entities/order_detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Producto, OrderDetail])
    ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
