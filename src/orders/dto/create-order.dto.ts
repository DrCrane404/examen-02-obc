import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "../../order_details/dto/create-order_detail.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @ApiProperty({ example: 150.99, description: 'Monto total de la orden' })
    @IsNotEmpty()
    @IsNumber()
    amount!:number;

    @ApiProperty({ example: 'Calle Falsa 123, Ciudad', description: 'Dirección de envío' })
    @IsNotEmpty()
    @IsString()
    shipping_address!:string;

    @ApiProperty({ example: 'Av. Siempre Viva 742', description: 'Dirección de la orden' })
    @IsNotEmpty()
    @IsString()
    order_address!:string;

    @ApiProperty({ example: 'cliente@correo.com', description: 'Correo asociado a la orden' })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    order_email!:string;

    @ApiProperty({ example: '2024-12-01', description: 'Fecha de la orden (YYYY-MM-DD)' })
    @IsString()
    order_date!:string;

    @ApiProperty({ 
        example: 'pending', 
        description: 'Estado de la orden',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    })
    @IsNotEmpty()
    @IsString()
    order_status!:string;

    @ApiProperty({
        description: 'Detalle de productos en la orden',
        type: () => [CreateOrderDetailDto],
        example: [{ product: 1, quantity: 2 }]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderDetailDto)
    details!: CreateOrderDetailDto[];
}
