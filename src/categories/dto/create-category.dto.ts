import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example:'Category_Name'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name!:string;
    
    @ApiProperty({example:'Descripccion del producto'})
    @IsString()
    @MaxLength(50)
    description!:string;

    @ApiProperty({example:'nombreArchivo.jpg'})
    @IsString()
    thumbnail!:string;
}
