import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";

export class CreateOrderDetailDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  product!: number;

  @ApiProperty({ example: 2, description: 'Cantidad del producto' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
