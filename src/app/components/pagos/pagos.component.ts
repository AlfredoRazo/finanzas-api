import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5/dist/md5';

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
        convenio.value = '10000';
        convenio.name = 'convenio';
        pagosForm.appendChild(convenio);
        referencia.value = '1000000'
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
        const s_transm = document.createElement('input');
        const c_referencia = document.createElement('input');
        const t_servicio = document.createElement('input');
        const t_importe = document.createElement('input');
        const t_pago = document.createElement('input');
        const val_11 = document.createElement('input');
        const val_12 = document.createElement('input');
        const val_13 = document.createElement('input');


        multiPagosform.method = 'POST';
        multiPagosform.action = environment.bbvaEndpoint;

        s_transm.value = 'transm';
        s_transm.name = 's_transm';
        multiPagosform.appendChild(s_transm);
        c_referencia.value = 'REF';
        c_referencia.name = 'c_referencia';
        multiPagosform.appendChild(c_referencia);
        t_servicio.value = '569';
        t_servicio.name = 't_servicio';
        multiPagosform.appendChild(t_servicio);
        t_importe.value = this.monto;
        t_importe.name = 't_importe';
        multiPagosform.appendChild(t_importe);
        const cadenaValidacion = s_transm.value + c_referencia.value + t_importe.value.padStart(15, '0') + t_servicio.value;
        val_13.value = Md5.hashStr(cadenaValidacion).toString();
        val_13.name = 'val_13';
        multiPagosform.appendChild(val_13);

        document.body.appendChild(multiPagosform);
        multiPagosform.submit();
        break;

      default:
        break;
    }



  }

}
