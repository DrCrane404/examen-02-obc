import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  
  constructor(@InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    private jwtService:JwtService){}

  async create(dto: CreateUserDto) {
    const { email, password } = dto;
    const emailExist = await this.userRepo.findOneBy({ email });
    if (emailExist) {
      throw new ConflictException({ 
        saturacion: 400, 
        error: 'conflict', 
        message: ['El email ya existe'] });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ ...dto, password: hashPassword, role: 'user' });
    const savedUser = await this.userRepo.save(user);

    const customer = this.customerRepo.create({
      full_name: '',
      billing_address: '',
      default_shipping_address: '',
      country: '',
      phone: '',
      user: savedUser,
    });
    await this.customerRepo.save(customer);

    return { id: savedUser.id, name: savedUser.name, email: savedUser.email };
  }

  async login(loginUserDto: loginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['customer'],
    });

    if (!user) {
      throw new NotFoundException({ 
        saturacion: 404,
        error: 'Not Found', 
        message: ['El usuario no existe'] });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException({ 
        saturacion: 401, 
        error: 'User Not Authorized', 
        message: ['Credenciales incorrectas'] });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      customerId: user.customer?.id,
    };

    return { token: await this.jwtService.signAsync(payload) };
  }

  async updateUser(id: number, dto: any) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    //Encriptacion de la contraseña si es que es actualizada
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    const update = await this.userRepo.save(user);
    //Esclusion de los datos sensibles
    const { password, role, ...result } = update;

    return result;
  }

  async removeUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    await this.userRepo.remove(user)
    return {
      id,
      email: user.email
    };
  }

  async makeAdmin(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.role = 'admin';
    const updated = await this.userRepo.save(user);
    return { id: updated.id, email: updated.email, role: updated.role };
  }

  async findUsers(user: any) {
    const u = await this.userRepo.findOne({
      where: { id: user.sub }
    });

    return {
      id: u?.id,
      email: u?.email
    }
  }

  //Temporal
  async setRole(email: string, role: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.role = role;
    await this.userRepo.save(user);
    return { email: user.email, role: user.role };
  }
  //Temporal
}
