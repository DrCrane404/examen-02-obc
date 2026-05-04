import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private jwtService:JwtService){}
  
  async canActivate(context: ExecutionContext,): Promise<boolean> {
    //Aqui vamos a manejar la logica de verificar
    //1.Que le esta enviando un token
    //1.Obtener la solicitud del cliente
    const request = context.switchToHttp().getRequest<Request>();
    //1.2 Obtener el token
    const token= this.extractTokenFromHeader(request)
    //2.Ese token es valido (esta completo,que no esta caducado, etc)
    //2.1 Verificar que si se mando el token
    if (!token) {
      throw new UnauthorizedException('Falta el token')
    }
    //2.2 Verificar que sea un token valido
    try {
      //Payload = carga util
      const payload = await this.jwtService.verifyAsync(token)
      //Agregamos a nuestra solicitud el usuario que verificamos
      request ['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token expirado o invalido')
    }
    return true;
  }
  //Verificar solicitud tras token
  private extractTokenFromHeader (request: Request):string | undefined{
      const [type, token]= request.headers.authorization?.split(' ') ?? [];
      //Si existe la palabra Bearer regresa el token 
      return type === 'Bearer'? token:undefined;
    }
}