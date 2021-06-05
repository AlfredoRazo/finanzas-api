import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;

@Component({
  selector: 'app-recinto-nueva-solicitud',
  templateUrl: './recinto-nueva-solicitud.component.html',
  styleUrls: ['./recinto-nueva-solicitud.component.css']
})
export class RecintoNuevaSolicitudComponent implements OnInit {
  manifiesto = '';
  page = 1;
  manifiestoData: any = [];
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
  man: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    public http: HttpClient) { }

  ngOnInit(): void {
    $('#fecha-servicio').datepicker();
    $('#fecha-arribo').datepicker();
    $('#fecha-inicio-operaciones').datepicker();
    $('#fecha-zarpe').datepicker();
  }

  consulta(): void {
    this.spinner.show();
    this.http.post<any>(environment.endpoint + 'sicrefis', { manifiesto: this.manifiesto, buque: '' }).subscribe(res => {
      this.spinner.hide();
      this.manifiestoData = res.manifiestos;
      this.man = res.man;
    }, error => {
      this.spinner.hide();
    })
  }

}
