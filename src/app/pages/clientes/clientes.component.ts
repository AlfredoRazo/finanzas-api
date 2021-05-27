import { Component, OnInit } from '@angular/core';
export interface CardMenu {
  titulo: string;
  icono: string;
  link: string;
}
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  dash: CardMenu[] = [
    {titulo: 'Maniobrista', icono: 'glyphicon glyphicon-user', link: 'maniobrista'},
    {titulo: 'Agente aduanal', icono: 'glyphicon glyphicon-user', link: 'agente-aduanal'},
    {titulo: 'Naviera', icono: 'glyphicon glyphicon-user', link: 'naviera'},
   ];

  constructor() { }

  ngOnInit(): void {
  }

}
