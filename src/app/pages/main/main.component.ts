import { Component, OnInit } from '@angular/core';
export interface CardMenu {
  titulo: string;
  icono: string;
  link: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  dash: CardMenu[] = [
    {titulo: 'Clientes', icono: 'glyphicon glyphicon-user', link: '/clientes'},
    {titulo: 'Facturación', icono: 'glyphicon glyphicon-briefcase', link: '/facturacion'},
    {titulo: 'Recinto', icono: 'glyphicon glyphicon-tower', link: '/recinto'},
    {titulo: 'Estadística', icono: 'glyphicon glyphicon-stats', link: '/estadistica'},
    {titulo: 'Operaciones', icono: 'glyphicon glyphicon-list-alt', link: '/operaciones'},
    {titulo: 'Protección Portuaria', icono: 'glyphicon glyphicon-lock', link: '/proteccion-portuaria'},
   ];

  constructor() { }

  ngOnInit(): void {
  }

}
