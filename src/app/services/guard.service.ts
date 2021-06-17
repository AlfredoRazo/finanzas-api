import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public role: RoleService, 
    public router : Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    if(!this.auth.isAuthenticated()){
      this.router.navigate(['/']);
    }
    switch (this.auth.getSession().userData.rol) {
      case 'FINANZAS':
        if(route.url[0].path == 'main' || route.url[0].path == 'facturacion'){
          return this.auth.isAuthenticated();
        }else{
          this.router.navigate(['/main']);
          return false;
        }
        break;
      default:
        return this.auth.isAuthenticated();
        break;
    }
    
  }

}
