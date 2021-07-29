import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-pago-success',
  templateUrl: './pago-success.component.html',
  styleUrls: ['./pago-success.component.css']
})
export class PagoSuccessComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private http: HttpClient) { }
  data = {
    appkey: environment.appKey,
    banco: 'Santander',
    estatus: '',
    valores: '',
    mensaje: '',
    folio: '',
    nombre: '',
    referencia: '',
    fecha: '',
    importe: '',
  };
  estatus = 1;
  type = 0;
  ngOnInit(): void {
    console.log(window.location.pathname);
    this.activeRoute.queryParams
      .subscribe(params => {
        switch (window.location.pathname) {
          case '/santander10':
            this.type = 1;
            this.estatus = params?.estatus;
            this.data.estatus = params?.estatus;
            this.data.mensaje = params?.mensaje;
            this.data.folio = params?.folio_oper;
            this.data.nombre = params?.nomUsuario;
            this.data.referencia = params?.referencia;
            this.data.fecha = `${params?.fecha} ${params?.hora}`;
            this.data.importe = params?.importe;
            this.http.post(`${environment.endpointApi}bancosRespuesta`, this.data).subscribe((resBanco: any) => {
            });
            
            break;
          case '/bbva10':
            this.type = 2;
            break;
            case '/bbvaE10':
              this.type = 3;
              break;
        
          default:
            break;
        }
       

      });
  }

}
