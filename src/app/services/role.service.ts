import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CardMenu } from '../pages/main/main.component';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private router: Router) { }

  reditecByRole(role: string): void{
    switch (role) {
      case 'FINANZAS':
        this.router.navigate(['/facturacion']);
        break;
      default:
        this.router.navigate(['/main']);
        break;
    }
  }

  getMenuByRole(role: string): CardMenu[]{
    switch (role) {
      case 'FINANZAS':
        return [
          {titulo: 'Facturación', icono: 'glyphicon glyphicon-briefcase', link: '/facturacion'}
         ];
        break;
      default:
        return [
          {titulo: 'Clientes', icono: 'glyphicon glyphicon-user', link: '/clientes'},
          {titulo: 'Facturación', icono: 'glyphicon glyphicon-briefcase', link: '/facturacion'},
          {titulo: 'Recinto', icono: 'glyphicon glyphicon-tower', link: '/recinto'},
          {titulo: 'Estadística', icono: 'glyphicon glyphicon-stats', link: '/estadistica'},
          {titulo: 'Operaciones', icono: 'glyphicon glyphicon-list-alt', link: '/operaciones'},
          {titulo: 'Protección Portuaria', icono: 'glyphicon glyphicon-lock', link: '/proteccion-portuaria'},
         ];
        break;
    }
    
  }
}
