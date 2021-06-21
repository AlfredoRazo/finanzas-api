import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  page = 1;
  data : any = [];
  filter: any[] = [
    'Estatus',
    'Consulta de pago',
    'Fecha de la consulta',
    'Tipo de Servicio',
    'Factura',
    'Fecha de la factura',
    'Cliente',
    'Solicitante',
    'UUID',
    'Subtotal',
    'Descuentos',
    'IVA',
    'Total',
    'Fecha de pago',
    'Referencia de pago'
  ];

  constructor(private http:HttpClient,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}consultasDetalle`).subscribe((res: any)=> {
      this.spinner.hide();
      this.data = res[0];
    },error =>{this.spinner.hide()})

  }

}
