import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {
  page = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      empresa: 'La junta',
      tipo: 'Pago de aranceles',
      estado: 'Pendiente'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
