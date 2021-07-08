import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  page = 1;
  total = 0;
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
  submenu = 1;

  constructor(
    private http:HttpClient,
    private pagina:PaginateService,
    private help:HelpersService,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}consultasDetalle`).subscribe((res: any)=> {
      this.spinner.hide();
      this.data = res[0];
      this.total = res[0].length;
    },error =>{this.spinner.hide()})

  }

  sendPago(banco: string, total: string) : void {
    const monto = total.replace(/\$/g, '').replace(/\,/g, '');
    if(banco == 'santander'){
    const multiPagosform = document.createElement('form');
    const convenio = document.createElement('input');
    const referencia = document.createElement('input');
    const importe = document.createElement('input');
    const url_resp = document.createElement('input');
    
    multiPagosform.method = 'POST';
    multiPagosform.action = environment.santanderEndpoint;
    convenio.value = '10000';
    convenio.name = 'convenio';
    multiPagosform.appendChild(convenio);
    referencia.value = '1000000'
    referencia.name = 'referencia';
    multiPagosform.appendChild(referencia);
    //importe.value = monto;
    importe.value = '0.10';
    importe.name = 'importe';
    multiPagosform.appendChild(importe);
    url_resp.value = 'http://pismzo.azurewebsites.net/pis/';
    url_resp.name = 'url_resp';
    multiPagosform.appendChild(url_resp);
    
    document.body.appendChild(multiPagosform);
    multiPagosform.submit();
    }
  }

}
