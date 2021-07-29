import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { PdfService } from '@serv/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-pagos-table',
  templateUrl: './pagos-table.component.html',
  styleUrls: ['./pagos-table.component.css']
})
export class PagosTableComponent implements OnInit {
  @Input() parent= 'facturacion';
  checkAll = false;
  apagar: any = [];
  referencia = '';
  vigencia = '';
  totalApagar = 0;
  hoy = new Date();
  pagobbva: any = {};
  pagosantander: any = {};
  totalPago = 0;
  pagePago = 0;
  filtro = false;
  filterData:any = [];
  originalData : any = [];
  collSize = 50;
  descPaginado = '';
  data: any = [];
  isPagar = false;
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

  constructor(private http: HttpClient,
    private pagina: PaginateService,
    private help: HelpersService,
    private auth: AuthService,
    private pdf: PdfService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getData();
  }

  checks(): void {
    this.originalData = this.originalData.map((item: any) => { item.selected = this.checkAll; return item });
    this.data = this.pagina.paginate(this.originalData, 10, this.pagePago);
  }

  paginado(evt: any = null): void {
    if(this.filtro){
      this.data = this.pagina.paginate(this.filterData, 10, this.pagePago);
    }else{
      this.data = this.pagina.paginate(this.originalData, 10, this.pagePago);
    }
    this.descripcionPaginado();
  }

  getData(): void {
    this.spinner.show();
    let query = '';
    if(this.parent != 'facturacion'){
      query = '?rfc=' + this.auth.getSession().userData.rfc;
    }
    this.http.get(`${environment.endpoint}consultasDetalle${query}`).subscribe((res: any) => {
      this.spinner.hide();
      this.originalData = res[0].map((item: any) => {
        item.selected = false;
        return item;
      });
      this.totalPago = res[0].length;
      this.data = [...this.originalData];
      this.data = this.pagina.paginate(res[0], this.collSize, this.pagePago);
      this.descripcionPaginado();
    }, error => { this.spinner.hide() })
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.totalPago + this.collSize - 1) / this.collSize);
    var start = (this.pagePago * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.totalPago);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }

  pagarMode(): void {
    this.apagar = this.data.filter((item: any) => item.selected);
    if (this.apagar.length > 0) {
      this.apagar.forEach((element: any) => {
        const monto = Number(element.total.replace(/\$/g, '').replace(/\,/g, ''));
        //this.totalApagar = this.totalApagar + monto;
      });
      
      const payload = {
        appkey : environment.appKey,
        numconsultaSAP: this.apagar.map((item: any) => {return item.noConsulta})
      }
      this.spinner.show();
      this.http.post(`${environment.endpointApi}referenciaGenerar`, payload).subscribe((res: any) =>{
        this.spinner.hide();
        this.isPagar = true;
        this.referencia = res[0].lc;
        this.totalApagar = res[0].total;
        this.vigencia = res[0].vigencia;
        this.pagobbva = res [1];
        this.pagosantander = res[2];
      }, error => {this.spinner.hide();
        this.referencia = '';
        this.totalApagar = 0;
        this.vigencia = ''});
      
    }
  }

  sendPago(banco: string, total: string): void {
   const monto = total.replace(/\$/g, '').replace(/\,/g, '');
   if (banco == 'santander') {
      const multiPagosform = document.createElement('form');
      const convenio = document.createElement('input');
      const referencia = document.createElement('input');
      const importe = document.createElement('input');
      const url_resp = document.createElement('input');

      multiPagosform.method = 'POST';
      multiPagosform.target = '_blank';
      multiPagosform.style.cssText = 'display:none;';
      multiPagosform.action = environment.santanderEndpoint;
      convenio.value = '7164';
      convenio.name = 'convenio';
      multiPagosform.appendChild(convenio);
      referencia.value = this.pagosantander.refSantander;
      referencia.name = 'referencia';
      multiPagosform.appendChild(referencia);
      importe.value = this.totalApagar.toString();
      importe.name = 'importe';
      multiPagosform.appendChild(importe);
      url_resp.value = environment.santanderResponse;
      url_resp.name = 'url_resp';
      multiPagosform.appendChild(url_resp);

      document.body.appendChild(multiPagosform);
      multiPagosform.submit();
    }
    if (banco === 'bbva') {
      const multiPagosform = document.createElement('form');
        multiPagosform.method = 'POST';
        multiPagosform.target = '_blank';
        multiPagosform.action = environment.bbvaEndpoint;
        multiPagosform.style.cssText = 'display:none;'

        const s_transm = document.createElement('input');
        const c_referencia = document.createElement('input');
        const t_servicio = document.createElement('input');
        const t_importe = document.createElement('input');
        const t_pago = document.createElement('input');
        const n_autoriz = document.createElement('input');
        const val_1 = document.createElement('input');
        const val_2 = document.createElement('input');
        const val_3 = document.createElement('input');
        const val_4 = document.createElement('input');
        const val_5 = document.createElement('input');
        const val_6 = document.createElement('input');
        const val_11 = document.createElement('input');
        const val_12 = document.createElement('input');
        const val_13 = document.createElement('input');
        
        s_transm.value = this.pagobbva?.s_transm;
        s_transm.name = 's_transm';
        multiPagosform.appendChild(s_transm);
        c_referencia.value = this.pagobbva?.c_referencia;
        c_referencia.name = 'c_referencia';
        multiPagosform.appendChild(c_referencia);

        val_1.value = this.pagobbva?.val_1;
        val_1.name = 'val_1';
        multiPagosform.appendChild(val_1);

        t_servicio.value = this.pagobbva?.t_servicio;
        t_servicio.name = 't_servicio';
        multiPagosform.appendChild(t_servicio);

        t_importe.value = this.pagobbva?.t_importe?.toFixed(2).toString();
        t_importe.name = 't_importe';
        multiPagosform.appendChild(t_importe);

        val_2.value = this.pagobbva?.val_2;
        val_2.name = 'val_2';
        multiPagosform.appendChild(val_2);

        val_3.value = this.pagobbva?.val_3;
        val_3.name = 'val_3';
        multiPagosform.appendChild(val_3);

        val_4.value = this.pagobbva?.val_4;
        val_4.name = 'val_4';
        multiPagosform.appendChild(val_4);

        val_5.value = this.pagobbva?.val_5;
        val_5.name = 'val_5';
        multiPagosform.appendChild(val_5);

        val_6.value = '';
        val_6.name = 'val_6';
        multiPagosform.appendChild(val_6);

        val_11.value = '';
        val_11.name = 'val_11';
        multiPagosform.appendChild(val_11);
  
        val_12.value = '';
        val_12.name = 'val_12';
        multiPagosform.appendChild(val_12);

        const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value;
       
        val_13.value = sha256.hmac(environment.bbvaKey, cadenaValidacion);
        //val_13.value = this.pagobbva?.val_13;
        val_13.name = 'val_13';
        
        multiPagosform.appendChild(val_13);

        /*const mp_urlsuccess = document.createElement('input');
        mp_urlsuccess.value = 'http://pismzo.azurewebsites.net/pis/';
        mp_urlsuccess.name = 'mp_urlsuccess';
        multiPagosform.appendChild(mp_urlsuccess);

        const mp_urlfailure = document.createElement('input');
        mp_urlfailure.value = 'http://pismzo.azurewebsites.net/pis/';
        mp_urlfailure.name = 'mp_urlfailure';
        multiPagosform.appendChild(mp_urlfailure);
      */
        document.body.appendChild(multiPagosform);
        multiPagosform.submit();
    }
  }

  imprimir(): void {
    const DATA = document.getElementById('contenido-imprimir');
    this.pdf.downloadPdf(DATA);

  }

}