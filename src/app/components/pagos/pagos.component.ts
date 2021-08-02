import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { sha256 } from 'js-sha256';
import { generate } from 'shortid';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  monto = '1.00';
  convenio = '7164';
  referencia = '';
  banco = 'bbva';

  bbvaPayload = {
    s_transm: generate().padStart(20, '0').toUpperCase(),
    c_referencia: '',
    val_1: '0',
    t_servicio: '569',
    t_importe: '',
    val_2: '',
    val_3: '1',
    val_4: '1',
    val_5: '1',
    val_6: '',
    val_11: '',
    val_12: ''
  }

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
        pagosForm.target = '_blank';
        pagosForm.action = environment.santanderEndpoint;
        pagosForm.style.cssText = 'display:none;';
        convenio.value = this.convenio;
        convenio.name = 'convenio';
        pagosForm.appendChild(convenio);
        referencia.value = this.referencia;
        referencia.name = 'referencia';
        pagosForm.appendChild(referencia);
        importe.value = this.monto;
        importe.name = 'importe';
        pagosForm.appendChild(importe);
        url_resp.value = environment.santanderResponse;
        url_resp.name = 'url_resp';
        pagosForm.appendChild(url_resp);

        document.body.appendChild(pagosForm);
        pagosForm.submit();

        break;
      case 'bbva':
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

        s_transm.value = this.bbvaPayload.s_transm;
        s_transm.name = 's_transm';
        multiPagosform.appendChild(s_transm);

        c_referencia.value = this.referencia.padEnd(20, '0').slice(0,20).toUpperCase();
        c_referencia.name = 'c_referencia';
        multiPagosform.appendChild(c_referencia);

        val_1.value = this.bbvaPayload.val_1;
        val_1.name = 'val_1';
        multiPagosform.appendChild(val_1);

        t_servicio.value = this.bbvaPayload.t_servicio;
        t_servicio.name = 't_servicio';
        multiPagosform.appendChild(t_servicio);

        t_importe.value = this.monto;
        t_importe.name = 't_importe';
        multiPagosform.appendChild(t_importe);

        val_2.value = this.bbvaPayload.val_2;
        val_2.name = 'val_2';
        multiPagosform.appendChild(val_2);

        val_3.value = this.bbvaPayload.val_3;
        val_3.name = 'val_3';
        multiPagosform.appendChild(val_3);

        val_4.value = this.bbvaPayload.val_4;
        val_4.name = 'val_4';
        multiPagosform.appendChild(val_4);

        val_5.value = this.bbvaPayload.val_5;
        val_5.name = 'val_5';
        multiPagosform.appendChild(val_5);

        val_6.value = this.bbvaPayload.val_6;
        val_6.name = 'val_6';
        multiPagosform.appendChild(val_6);

        val_11.value = this.bbvaPayload.val_11;
        val_11.name = 'val_11';
        multiPagosform.appendChild(val_11);
  
        val_12.value = this.bbvaPayload.val_12;
        val_12.name = 'val_12';
        multiPagosform.appendChild(val_12);

        //const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value;
        const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value;
        
        
        val_13.value = sha256.hmac(environment.bbvaKey, cadenaValidacion);
        val_13.name = 'val_13';
        multiPagosform.appendChild(val_13);

        const mp_urlsuccess = document.createElement('input');
        mp_urlsuccess.value = 'http://pismzo.azurewebsites.net/pis/';
        mp_urlsuccess.name = 'mp_urlsuccess';
        multiPagosform.appendChild(mp_urlsuccess);

        const mp_urlfailure = document.createElement('input');
        mp_urlfailure.value = 'http://pismzo.azurewebsites.net/pis/';
        mp_urlfailure.name = 'mp_urlfailure';
        multiPagosform.appendChild(mp_urlfailure);

        document.body.appendChild(multiPagosform);
        multiPagosform.submit();
        break;
      default:
        break;
    }
  }

}
