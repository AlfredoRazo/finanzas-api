import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-agente-nueva-solicitud',
  templateUrl: './agente-nueva-solicitud.component.html',
  styleUrls: ['./agente-nueva-solicitud.component.css']
})
export class AgenteNuevaSolicitudComponent implements OnInit {
  page = 1;
  data = [
    {
      manifiesto: 123412,
      marca: 'Marca',
      embalaje: 'Embalaje',
      piezas: '10',
      peso: '2 toneladas',
      unidades: '1000'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    $('#fecha-servicio').datepicker();
    $('#fecha-arribo').datepicker();
    $('#fecha-inicio-operaciones').datepicker();
    $('#fecha-zarpe').datepicker();
  }

}
