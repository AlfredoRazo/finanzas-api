import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  monto = '';
  banco = '';

  constructor() { }

  ngOnInit(): void {
  }

  sendPago(): void {
    switch (this.banco) {
      case 'santander':
        const pagosForm = document.createElement('form');
        const convenio = document.createElement('input');
        const referencia = document.createElement('input');
        const importe = document.createElement('input');
        const url_resp = document.createElement('input');

        pagosForm.method = 'POST';
        pagosForm.action = environment.santanderEndpoint;
        convenio.value = '7164';
        convenio.name = 'convenio';
        pagosForm.appendChild(convenio);
        referencia.value = '1998II157KAU04660243'
        referencia.name = 'referencia';
        pagosForm.appendChild(referencia);
        importe.value = this.monto;
        importe.name = 'importe';
        pagosForm.appendChild(importe);
        url_resp.value = 'http://pismzo.azurewebsites.net/pis/';
        url_resp.name = 'url_resp';
        pagosForm.appendChild(url_resp);

        document.body.appendChild(pagosForm);
        pagosForm.submit();

        break;
      case 'bbva':
        const multiPagosform = document.createElement('form');
        multiPagosform.method = 'POST';
        multiPagosform.action = environment.bbvaEndpoint;
  
        const mp_account = document.createElement('input');
        mp_account.value = '1';
        mp_account.name = 'mp_account';
        multiPagosform.appendChild(mp_account);
  
        const mp_order = document.createElement('input');
        mp_order.value = '20140717';
        mp_order.name = 'mp_order';
        multiPagosform.appendChild(mp_order);
  
        const mp_reference = document.createElement('input');
        mp_reference.value = 'QWERTY123456';
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
        mp_amount.value = this.monto;
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
        multiPagosform.appendChild(mp_urlfailure);
        /*const multiPagosform = document.createElement('form');
        const s_transm = document.createElement('input');
        const c_referencia = document.createElement('input');
        const t_servicio = document.createElement('input');
        const t_importe = document.createElement('input');
        const t_pago = document.createElement('input');
        const n_autoriz = document.createElement('input');
        const val_1 = document.createElement('input');
        const val_3 = document.createElement('input');
        const val_11 = document.createElement('input');
        const val_12 = document.createElement('input');
        const val_13 = document.createElement('input');


        multiPagosform.method = 'POST';
        multiPagosform.action = environment.bbvaEndpoint;

        s_transm.value = 'transm';
        s_transm.name = 's_transm';
        multiPagosform.appendChild(s_transm);

        c_referencia.value = 'REF213213213123';
        c_referencia.name = 'c_referencia';
        multiPagosform.appendChild(c_referencia);

        t_servicio.value = '569';
        t_servicio.name = 't_servicio';
        multiPagosform.appendChild(t_servicio);

        n_autoriz.value = '569';
        n_autoriz.name = 'n_autoriz';
        multiPagosform.appendChild(n_autoriz);

        t_pago.value = '01';
        t_pago.name = 't_pago';
        multiPagosform.appendChild(t_pago);

        t_importe.value = this.monto;
        t_importe.name = 't_importe';
        multiPagosform.appendChild(t_importe);

        val_1.value = '0';
        val_1.name = 'val_1';
        multiPagosform.appendChild(val_1);

        val_3.value = '1';
        val_3.name = 'val_3';
        multiPagosform.appendChild(val_3);

        const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value + n_autoriz.value.padStart(18, '0') + environment.bbvaKey;
        val_13.value = sha256.hmac(environment.bbvaKey, cadenaValidacion);
        val_13.name = 'val_13';
        multiPagosform.appendChild(val_13);

        document.body.appendChild(multiPagosform);
        multiPagosform.submit();*/
        break;
      default:
        break;
    }



  }

}
