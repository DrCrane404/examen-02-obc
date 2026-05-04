import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {

  constructor(@InjectRepository(Customer) private customerRepo: Repository<Customer>){}

  async findByUserId(userId: number) {
    const customer = await this.customerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'orders'],
    });

    if (!customer) throw new NotFoundException('Perfil no encontrado');

    const { user, ...rest } = customer;
    return {
      ...rest,
      user: user ? { id: user.id, email: user.email, name: user.name} : null
    };
  }

  async updateByUserId(userId: number, dto: UpdateCustomerDto) {
    const customer = await this.customerRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!customer) throw new NotFoundException('Perfil no encontrado');

    Object.assign(customer, dto);
    return await this.customerRepo.save(customer);
  }

  async findAll() {
    const customers = await this.customerRepo.find({
      relations: ['user','orders'],
    });

    return customers.map(c => ({
      ...c,
      user: c.user ? { id: c.user.id, email: c.user.email, name: c.user.name, role: c.user.role } : null
    }));
  } 

  async findOne(id: number) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['user','orders'],
    });

    if (!customer) {
      throw new NotFoundException('Customer no encontrado');
    }
    const { user, ...rest } = customer;
    return {
      ...rest,
      user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null
    };
  } 

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer no encontrado');

    Object.assign(customer, dto);
    return await this.customerRepo.save(customer);
  }

  async remove(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer no encontrado');
    await this.customerRepo.remove(customer);
    return { id, full_name: customer.full_name };
  }
}
