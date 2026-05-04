import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOptionDto {
    @ApiProperty({example:'Option_name'})
    @IsString()
    @IsNotEmpty()
    option_name!:string;
}
