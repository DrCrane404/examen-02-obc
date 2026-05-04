import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({example: 'Fulano'})
    @IsString()
    name!:string;

    @ApiProperty({example: 'email@example.com'})
    @IsString()
    @IsEmail()
    email!:string;

    @ApiProperty({example: '12eundAJNoxl'})
    @IsString()
    @MinLength(8)
    password!:string;
}