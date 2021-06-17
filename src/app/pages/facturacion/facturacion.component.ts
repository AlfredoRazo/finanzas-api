import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  page = 1;
  data : any = [
  /* {
      id: 123,
      fecha: '28/05/2021',
      empresa: 'La junta',
      concepto: 'Pago de aranceles',
      total: '38987',
      estado: 'Pendiente',
      cfdi: ''
    }*/
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
