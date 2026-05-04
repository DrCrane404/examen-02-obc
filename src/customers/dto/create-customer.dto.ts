import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCustomerDto {

    @ApiProperty({example:'Fulano De Tal'})
    @IsString()
    @IsNotEmpty()
    full_name!:string;

    @ApiProperty({example:'Calle ### Col. Tal'})
    @IsString()
    @IsNotEmpty()
    billing_address!:string;

    @ApiProperty({example:'Calle ### Col. Tal'})
    @IsString()
    @IsNotEmpty()
    default_shipping_address!:string;

    @ApiProperty({example:'Nombre_Pais'})
    @IsString()
    @IsNotEmpty()
    country!:string;

    @ApiProperty({example:'795262612'})
    @IsString()
    @IsNotEmpty()
    phone!:string;
}
