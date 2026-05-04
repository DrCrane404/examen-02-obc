import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateProductoDto {
    @ApiProperty({ example: 'Laptop Gamer', description: 'Nombre del producto' })
    @IsString()
    @IsString()
    @IsNotEmpty()
    name!:string;

    @ApiProperty({ example: 'LAP-GAM-001', description: 'Código único del producto' })
    @IsString()
    @IsNotEmpty()
    sku!:string;

    @ApiProperty({ example: 999.99, description: 'Precio del producto', minimum: 0 })
    @IsNumber()
    @Min(0)
    price!:number

    @ApiProperty({ example: 2.5, description: 'Peso del producto en kg', minimum: 0 })
    @IsNumber()
    @Min(0)
    weight!:number;

    @ApiProperty({ example: 'Laptop de alto rendimiento', description: 'Descripción del producto', maxLength: 100 })
    @IsString()
    @MaxLength(100)
    description!:string;

    @ApiProperty({ example: 'https://example.com/thumbnail.jpg', description: 'URL de la imagen miniatura' })
    @IsString()
    thumbnail!:string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL de la imagen principal' })
    @IsString()
    image!:string;

    @ApiProperty({ example: [1, 2], description: 'IDs de las categorías del producto', type: [Number] })
    @IsArray()
    @IsNumber({}, {each:true})
    categories!:number[];

    @ApiProperty({ example: '2024-12-01', description: 'Fecha de creación del producto' })
    @IsDateString()
    create_date!:string;

    @ApiProperty({ example: 100, description: 'Stock disponible del producto', minimum: 0 })
    @IsNumber()
    @Min(0)
    stock!:number;

    @ApiPropertyOptional({ example: [1, 3], description: 'IDs de opciones del producto (opcional)', type: [Number] })
    @IsArray()
    @IsOptional()
    @IsNumber({}, {each:true})
    options?: number[];
}