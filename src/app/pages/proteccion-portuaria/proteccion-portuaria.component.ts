import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proteccion-portuaria',
  templateUrl: './proteccion-portuaria.component.html',
  styleUrls: ['./proteccion-portuaria.component.css']
})
export class ProteccionPortuariaComponent implements OnInit {
  page = 1;
  submenu = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      empresa: 'La junta',
      concepto: 'Pago de aranceles',
      total: '38987',
      estado: 'Pendiente',
      cfdi: ''
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
