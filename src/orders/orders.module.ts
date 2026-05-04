import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { OrderDetail } from '../order_details/entities/order_detail.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Customer, OrderDetail, Producto])
    ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
