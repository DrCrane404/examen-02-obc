import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionsService {

  constructor (@InjectRepository(Option) private optionRepo: Repository<Option>){}

  async create(dto: CreateOptionDto) {
    const option = this.optionRepo.create(dto);
    return await this.optionRepo.save(option)
  }

  async findAll() {
    return await this.optionRepo.find({
      relations: ['products'],
    });
  }

async findOne(id: number) {
  const option = await this.optionRepo.findOne({
    where: { id },
    relations: ['products'],
  });
  if (!option) throw new NotFoundException('Opción no encontrada');
  return option;
}

async update(id: number, updateOptionDto: UpdateOptionDto) {
  const option = await this.optionRepo.findOne({ where: { id } });
  if (!option) throw new NotFoundException('Opción no encontrada');

  Object.assign(option, updateOptionDto);
  return await this.optionRepo.save(option);
}

async remove(id: number) {
  const option = await this.optionRepo.findOne({ where: { id } });
  if (!option) throw new NotFoundException('Opción no encontrada');

  await this.optionRepo.remove(option);
  return { id, option_name: option.option_name };
}
}
