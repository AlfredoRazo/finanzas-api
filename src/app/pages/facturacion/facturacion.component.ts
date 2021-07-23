import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  page = 1;
  total = 0;
  data: any = [];
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
    private http: HttpClient,
    private pagina: PaginateService,
    private help: HelpersService,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getData();

  }

  getData(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}consultasDetalle`).subscribe((res: any) => {
      this.spinner.hide();
      this.data = res[0];
      this.total = res[0].length;
    }, error => { this.spinner.hide() })
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
      multiPagosform.target='_blank';
      multiPagosform.action = environment.santanderEndpoint;
      convenio.value = '7164';
      convenio.name = 'convenio';
      multiPagosform.appendChild(convenio);
      referencia.value = '1998II157KAU04660243'
      referencia.name = 'referencia';
      multiPagosform.appendChild(referencia);
      importe.value = '51.57';
      importe.name = 'importe';
      multiPagosform.appendChild(importe);
      url_resp.value = 'http://pismzo.azurewebsites.net/pis/';
      url_resp.name = 'url_resp';
      multiPagosform.appendChild(url_resp);

      document.body.appendChild(multiPagosform);
      multiPagosform.submit();
    }
    if (banco === 'bbva') {
      const multiPagosform = document.createElement('form');
      multiPagosform.method = 'POST';
      multiPagosform.target='_blank';
      multiPagosform.action = environment.bbvaEndpoint;

      /*const mp_account = document.createElement('input');
      mp_account.value = '159';
      mp_account.name = 'mp_account';
      multiPagosform.appendChild(mp_account);

      const mp_order = document.createElement('input');
      mp_order.value = '20140717';
      mp_order.name = 'mp_order';
      multiPagosform.appendChild(mp_order);

      const mp_reference = document.createElement('input');
      mp_reference.value = 'C008000018333471235';
      mp_reference.name = 'mp_reference';
      multiPagosform.appendChild(mp_reference);

      const mp_product = document.createElement('input');
      mp_product.value = '1';
      mp_product.name = 'mp_product';
      multiPagosform.appendChild(mp_product);

      const mp_node = document.createElement('input');
      mp_node.value = '0';
      mp_node.name = 'mp_node';
      multiPagosform.appendChild(mp_node);

      const mp_concept = document.createElement('input');
      mp_concept.value = '2';
      mp_concept.name = 'mp_concept';
      multiPagosform.appendChild(mp_concept);

      const mp_amount = document.createElement('input');
      mp_amount.value = monto;
      mp_amount.name = 'mp_amount';
      multiPagosform.appendChild(mp_amount);

      const mp_currency = document.createElement('input');
      mp_currency.value = '1';
      mp_currency.name = 'mp_currency';
      multiPagosform.appendChild(mp_currency);

      const mp_signature = document.createElement('input');
      const cadenaValidacion = mp_order.value + mp_amount.value + mp_amount.value;
      mp_signature.value = sha256.hmac(environment.bbvaKey, cadenaValidacion);
      mp_signature.name = 'mp_signature';
      multiPagosform.appendChild(mp_signature);

      const mp_urlsuccess = document.createElement('input');
      mp_urlsuccess.value = 'http://pismzo.azurewebsites.net/pis/';
      mp_urlsuccess.name = 'mp_urlsuccess';
      multiPagosform.appendChild(mp_urlsuccess);

      const mp_urlfailure = document.createElement('input');
      mp_urlfailure.value = 'http://pismzo.azurewebsites.net/pis/';
      mp_urlfailure.name = 'mp_urlfailure';
      multiPagosform.appendChild(mp_urlfailure);*/

      const s_transm = document.createElement('input');
      const c_referencia = document.createElement('input');
      const t_servicio = document.createElement('input');
      const t_importe = document.createElement('input');
      const t_pago = document.createElement('input');
      const n_autoriz = document.createElement('input');
      const val_1 = document.createElement('input');
      const val_3 = document.createElement('input');
      const val_4 = document.createElement('input');
      const val_5 = document.createElement('input');
      const val_6 = document.createElement('input');
      const val_11 = document.createElement('input');
      const val_12 = document.createElement('input');
      const val_13 = document.createElement('input');


      multiPagosform.method = 'POST';
      multiPagosform.action = environment.bbvaEndpoint;

      s_transm.value = 'C008000018333471235';
      s_transm.name = 's_transm';
      multiPagosform.appendChild(s_transm);

      c_referencia.value = 'C008000018333471235';
      c_referencia.name = 'c_referencia';
      multiPagosform.appendChild(c_referencia);

      val_1.value = '0';
      val_1.name = 'val_1';
      multiPagosform.appendChild(val_1);

      t_servicio.value = '569';
      t_servicio.name = 't_servicio';
      multiPagosform.appendChild(t_servicio);

      n_autoriz.value = '569';
      n_autoriz.name = 'n_autoriz';
      multiPagosform.appendChild(n_autoriz);

      t_pago.value = '01';
      t_pago.name = 't_pago';
      multiPagosform.appendChild(t_pago);

      t_importe.value = monto;
      t_importe.name = 't_importe';
      multiPagosform.appendChild(t_importe);

      val_3.value = '1';
      val_3.name = 'val_3';
      multiPagosform.appendChild(val_3);

      val_11.value = '1';
      val_11.name = 'val_11';
      multiPagosform.appendChild(val_11);

      val_12.value = '1';
      val_12.name = 'val_12';
      multiPagosform.appendChild(val_12);
  
      const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value;
      val_13.value = sha256.hmac(environment.bbvaKey, cadenaValidacion);
      val_13.name = 'val_13';
      multiPagosform.appendChild(val_13);

      document.body.appendChild(multiPagosform);
      multiPagosform.submit();
    }
  }

}
