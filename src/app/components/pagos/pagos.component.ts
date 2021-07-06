import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

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

  sendPago() : void {
    if(this.banco == 'santander'){
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
    importe.value = this.monto;
    importe.name = 'importe';
    multiPagosform.appendChild(importe);
    importe.value = this.monto;
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
