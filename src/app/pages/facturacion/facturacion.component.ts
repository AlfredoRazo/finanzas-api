import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;


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
  totalCFDI = 0;
  pageCFDI = 1;
  originalDataCFDI: any[] = [];
  dataCFDI: any[] = [];
  submenu = 1;
  fechaini = '';
  fechafin = '';
  desc = true;


  constructor(private http:HttpClient,
    private pagina:PaginateService,
    private help:HelpersService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getData();
    this.fechaini = this.help.today();
    this.fechafin = this.help.today();
    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect : (date: any)=>{this.fechaini = date}  });
      $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect : (date: any)=>{this.fechafin = date} }); 
  }

  getData(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}consultasDetalle`).subscribe((res: any)=> {
      this.spinner.hide();
      this.data = res[0];
    },error =>{this.spinner.hide()})

  }

  getCFDI(): void{
    this.spinner.show();
    this.http.get(`${environment.endpointApi}cfdi?rfc=API&fechaini=${this.fechaini}&fechafin=${this.fechafin}`).subscribe((res: any) => {
      this.pageCFDI = 1;
      this.spinner.hide();
      this.totalCFDI =res[0].length;
      this.originalDataCFDI = [...res[0]];
      this.dataCFDI = this.pagina.paginate(res[0],15,this.pageCFDI);
    },err=>{this.spinner.hide()});
  }

  paginado(page: any, key = null): void{
    this.dataCFDI = this.pagina.paginate(this.originalDataCFDI,10,this.pageCFDI);
  }

}
