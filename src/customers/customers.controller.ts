import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/auth.controller';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  
  @ApiOkResponse({ description: 'Perfil del cliente autenticado' })
  @Get('me')
  getMyProfile(@Req() req) {
    return this.customersService.findByUserId(req.user.sub);
  }
  
  @ApiOkResponse({ description: 'Perfil actualizado correctamente' })
  @Patch('me')
  updateMyProfile(@Req() req, @Body() dto: UpdateCustomerDto) {
    return this.customersService.updateByUserId(req.user.sub, dto);
  }

  @ApiOkResponse({ 
    description: 'Lista de todos los clientes',
    schema: { example: [{ id: 1, full_name: 'Fulano Pérez', billing_address: 'Calle 123', default_shipping_address: 'Av. Principal 456', country: 'México', phone: '7898456123' }] }
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @ApiOkResponse({ 
    description: 'Cliente encontrado',
    schema: { example: { id: 1, full_name: 'Fulano Pérez', billing_address: 'Calle 123', default_shipping_address: 'Av. Principal 456', country: 'México', phone: '7898456123' } }
  })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @ApiOkResponse({ 
    description: 'Cliente actualizado correctamente',
    schema: { example: { id: 1, full_name: 'Fulano Pérez', billing_address: 'Calle Nueva 789', default_shipping_address: 'Av. Principal 456', country: 'México', phone: '7898456123' } }
  })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @ApiOkResponse({ 
    description: 'Cliente eliminado correctamente',
    schema: { example: { id: 1, full_name: 'Juan Pérez' } }
  })
  @ApiNotFoundResponse({ description: 'Cliente no encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'developer')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
