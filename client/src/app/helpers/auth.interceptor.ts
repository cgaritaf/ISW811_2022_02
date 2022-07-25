import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

//Se incluye los servicios para manejar el token 
import { TokenStorageService } from '../service/token-storage.service'; 

//Nombre que lleva de la variable del encabezado que va a contener el token
const TOKEN_HEADER_KEY = 'x-access-token'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //Se obtiene la solicitud
    let authReq = request;

    //se obtiene el token (si no existe devuelve un undefined)
    const token = this.token.getToken();
    console.log('Token: ' + token);

    //Si existe un token almacenado de agrega a la solicitud, para que el backend lo tome y lo valide
    if (token != null) {
      authReq = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, token),
      });
    }
    return next.handle(authReq);
  }
}