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
      case 'RECINTO':
        this.router.navigate(['/recinto']);
      break;
      case 'ESTADISTICA':
        this.router.navigate(['/estadistica']);
      break;
      case 'OPERACIONES':
        this.router.navigate(['/operaciones']);
      break;
      case 'PPORTUARIA':
        this.router.navigate(['/proteccion-portuaria']);
      break;
      case 'MANIOBRISTA':
        this.router.navigate(['/clientes/maniobrista']);
      break;
      case 'AGENTEADUANAL':
        this.router.navigate(['/clientes/agente-aduanal']);
      break;
      case 'NAVIERA':
        this.router.navigate(['/clientes/naviera']);
      break;
      case 'CESIONARIO':
        this.router.navigate(['/clientes/cesionario']);
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