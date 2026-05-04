import { Controller, Get, Post, Body, Request, UseGuards, Patch, Param, Delete, Req, ForbiddenException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { AuthGuard} from './auth.guard';
import { RolesGuard } from './roles.guard';
import { ResponseUserDto } from './dto/response-user.dto';

import { SetMetadata } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}
 
  
  @ApiBody({type:CreateUserDto})
  @ApiCreatedResponse({type:User, description:"Cuando el registro esta completo"})
  @ApiBadRequestResponse({description:"Cuando falta un campo, o el formato es incorrecto "})
  @ApiConflictResponse({description:'Correo inexistente'})
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.authService.create(createUserDto);
  }
  
  @ApiBearerAuth()
  @ApiBody({type:CreateUserDto})
  @ApiCreatedResponse({type:User, description:"Usuario correctamente creado"})
  @ApiBadRequestResponse({description:"Cuando falta un campo, o el formato es incorrecto "})
  @ApiForbiddenResponse({description:'Solo el rol de developer puede crear usuarios'})
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('developer')
  @Post('/users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiBody({type: loginUserDto}) // Indica que requiere un body
  @ApiCreatedResponse({description: 'Cuando el acceso es correcto', schema: {example: {token: 'Token generado'}}})
  @ApiNotFoundResponse({description: 'Usuario no encontrado'})
  @ApiUnauthorizedResponse({description: 'Contraseña incorrecta'})
  @Post('/login')
  login(@Body() loginUserDto: loginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Retorna id y email del usuario autenticado', schema: { example: { id: 1, email: 'user@example.com' } } })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @UseGuards(AuthGuard)
  @Get('/profile')
  profile(@Request() req){
    return {
      id: req.user.sub,
      email: req.user.email
    };
  }

  @ApiBearerAuth()
  @ApiBody({ schema: { example: { email: 'nuevo@correo.com', password: 'nuevaPass123' } } })
  @ApiOkResponse({ description: 'Usuario actualizado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiForbiddenResponse({ description: 'Solo el rol developer puede actualizar usuarios' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('developer')
  @Patch('/users/:id')
  update(@Param('id') id: string, @Body() dto) {
    return this.authService.updateUser(+id, dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuario eliminado', schema: { example: { id: 1, email: 'user@example.com' } } })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiForbiddenResponse({ description: 'Solo el rol admin puede eliminar usuarios' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/users/:id')
  remove(@Param('id') id: string) {
    return this.authService.removeUser(+id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuario promovido a admin correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiForbiddenResponse({ description: 'Solo el rol admin puede promover usuarios' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('/users/:id/make-admin')
  makeAdmin(@Param('id') id: string) {
    return this.authService.makeAdmin(+id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Lista de usuarios', type: [User] })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no enviado' })
  @ApiForbiddenResponse({ description: 'Solo el rol admin puede ver todos los usuarios' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/users')
  findAll(@Req() req) {
    return this.authService.findUsers(req.user);
  }
}
