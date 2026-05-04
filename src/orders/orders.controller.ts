import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from '../auth/auth.controller';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Orden creada correctamente',
    schema: {
      example: {
        id: 1,
        amount: 299.99,
        shipping_address: 'Calle Falsa 123, Zacatecas',
        order_address: 'Av. Principal 456',
        order_email: 'cliente@correo.com',
        order_date: '2024-12-01',
        order_status: 'pending',
        customer: { id: 1 },
        details: [{ id: 1, quanty: 2, price: 150.99 }]
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @ApiOkResponse({
    description: 'Lista de órdenes del usuario autenticado',
    schema: {
      example: [{
        id: 1,
        amount: 299.99,
        shipping_address: 'Calle Falsa 123, Zacatecas',
        order_address: 'Av. Principal 456',
        order_email: 'cliente@correo.com',
        order_date: '2024-12-01',
        order_status: 'pending',
        customer: { id: 1 },
        details: [{ id: 1, quanty: 2, price: 150.99 }]
      }]
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @Get()
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user);
  }

  @ApiOkResponse({
    description: 'Orden encontrada',
    schema: {
      example: {
        id: 1,
        amount: 299.99,
        shipping_address: 'Calle Falsa 123, Zacatecas',
        order_address: 'Av. Principal 456',
        order_email: 'cliente@correo.com',
        order_date: '2024-12-01',
        order_status: 'pending',
        customer: { id: 1 },
        details: [{ id: 1, quanty: 2, price: 150.99 }]
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(+id, req.user);
  }

  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({
    description: 'Orden actualizada correctamente',
    schema: {
      example: {
        id: 1,
        amount: 350.00,
        shipping_address: 'Nueva Calle 789',
        order_address: 'Av. Principal 456',
        order_email: 'cliente@correo.com',
        order_date: '2024-12-01',
        order_status: 'processing',
        customer: { id: 1 },
        details: [{ id: 1, quanty: 2, price: 175.00 }]
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
    return this.ordersService.update(+id, updateOrderDto, req.user);
  }

  @ApiOkResponse({
    description: 'Orden eliminada correctamente',
    schema: { example: { id: 1, order_email: 'cliente@correo.com', order_status: 'cancelled' } }
  })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ordersService.remove(+id, req.user);
  }
}
