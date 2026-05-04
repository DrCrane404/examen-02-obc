import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailsService {
  
  constructor(
    @InjectRepository(OrderDetail)
    private detailRepo: Repository<OrderDetail>,
  ) {}

  async findAll() {
    return await this.detailRepo.find({
      relations: ['order', 'product'],
    });
  }

  async findOne(id: number) {
    const detail = await this.detailRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!detail) {
      throw new NotFoundException('Detalle no encontrado');
    }

    return detail;
  }
}
