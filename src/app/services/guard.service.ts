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
    public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    switch (this.auth.getSession().userData.rol) {
      case 'FINANZAS':
        if (route.url[0].path == 'facturacion') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/facturacion']);
          return false;
        }
        break;
      case 'RECINTO':
        if (route.url[0].path == 'recinto') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/recinto']);
          return false;
        }
        break;
      case 'ESTADISTICA':
        if (route.url[0].path == 'estadistica') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/estadistica']);
          return false;
        }
        break;
      case 'OPERACIONES':
        if (route.url[0].path == 'operaciones') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/operaciones']);
          return false;
        }
        break;
      case 'PPORTUARIA':
        if (route.url[0].path == 'proteccion-portuaria') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/proteccion-portuaria']);
          return false;
        }
        break;
      case 'MANIOBRISTA':
        if (route.url[1]?.path == 'maniobrista') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/clientes/maniobrista']);
          return false;
        }
        break;
      case 'AGENTEADUANAL':
        if (route.url[1]?.path == 'agente-aduanal') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/clientes/agente-aduanal']);
          return false;
        }
        break;
      case 'NAVIERA':
        if (route.url[1]?.path == 'naviera') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/clientes/naviera']);
          return false;
        }
        break;
      case 'CESIONARIO':
        if (route.url[1]?.path == 'cesionario') {
          return this.auth.isAuthenticated();
        } else {
          this.router.navigate(['/clientes/cesionario']);
          return false;
        }
        break;
      default:
        return this.auth.isAuthenticated();
        break;
    }

  }

}
