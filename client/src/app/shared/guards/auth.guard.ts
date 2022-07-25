import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
// importamos los servicios aquí
  constructor(private tokenStorageService: TokenStorageService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = !!this.tokenStorageService.getToken();
    if (!isAuthenticated) {
			// redirige al usuario a la pagina de login
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }

  }
}