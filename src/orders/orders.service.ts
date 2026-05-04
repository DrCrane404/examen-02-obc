import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderDetail } from '../order_details/entities/order_detail.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Order } from './entities/order.entity';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    
    @InjectRepository(OrderDetail)
    private detailRepo: Repository<OrderDetail>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(Producto)
      private productoRepo: Repository<Producto>
    ){}
  

  async create(dto: CreateOrderDto, user: any) {
    const customer = await this.customerRepo.findOne({
      where: { id: user.customerId }
    });
    if (!customer) throw new NotFoundException('Customer no existe');

    const order = this.orderRepo.create({
      customer,
      order_date: new Date(),
      order_status: 'PENDING',
      amount: 0,
      shipping_address: dto.shipping_address,
      order_address: dto.order_address,
      order_email: dto.order_email,
    });

    await this.orderRepo.save(order);

    const details: OrderDetail[] = [];
    for (const item of dto.details) {
      const product = await this.productoRepo.findOne({
        where: { id: item.product }
      });

      if (!product) {
        throw new NotFoundException(`Producto ${item.product} no existe`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
      }

      product.stock -= item.quantity;
      await this.productoRepo.save(product);

      const detail = this.detailRepo.create({
        order,
        product,
        quanty: item.quantity,
        price: product.price
      });
      details.push(detail);
    }

    await this.detailRepo.save(details);

    const total = details.reduce((sum, d) => sum + (Number(d.price) * d.quanty), 0);
    order.amount = total;

    return await this.orderRepo.save(order);
  }

  async findAll(user: any) {
    if (user.role === 'admin') {
      return await this.orderRepo.find({
        relations: ['customer', 'details', 'details.product'] 
      });
    }
    return await this.orderRepo.find({
      where: {
        customer: { user: { id: user.sub } }
      },
      relations: ['customer', 'details', 'details.product']
    });
  }

  async findOne(id: number, user: any) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer','customer.user', 'details', 'details.product']
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    if (user.role !== 'admin' && user.role !== 'developer') {
    if (order.customer.user.id !== user.sub) {
      throw new ForbiddenException('No tienes permiso para ver esta orden');
    }
    }
    return { id,
    order_status: order.order_status, 
    order_email: order.order_email, 
    details: order.details, 
    shipping_address: order.shipping_address,
    order_address: order.order_address,
    order_date: order.order_date,
    amount: order.amount
    };
  }

  async update(id: number, dto: Partial<UpdateOrderDto>, user: any) {
    const order = await this.findOne(id, user);
    Object.assign(order, dto);
    return await this.orderRepo.save(order);
  }

  async remove(id: number, user:any) {
    const order = await this.orderRepo.findOne({ 
      where: { id },
      relations:['customer', 'customer.user','details']
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    if (user.role !== 'admin' && user.role !== 'developer') {
      if (!order.customer?.user || order.customer.user.id !== user.sub) {
        throw new ForbiddenException('No tienes permiso para eliminar esta orden');
      }
    }
    if (order.details && order.details.length > 0) {
      await this.detailRepo.remove(order.details);
    }
    await this.orderRepo.remove(order);
    return { id, order_status: order.order_status, order_email: order.order_email };
  }
}
