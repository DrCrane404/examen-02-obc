import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/auth.controller';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Order Details')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin','developer')
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @ApiOkResponse({
    description: 'Lista de todos los detalles de órdenes'
  })
  @Get()
  findAll() {
    return this.orderDetailsService.findAll();
  }

  @ApiOkResponse({
    description: 'Detalle de orden encontrado'
  })
  @ApiNotFoundResponse({ description: 'Detalle de orden no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailsService.findOne(+id);
  }
}
