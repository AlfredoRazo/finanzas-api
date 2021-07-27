import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pago-success',
  templateUrl: './pago-success.component.html',
  styleUrls: ['./pago-success.component.css']
})
export class PagoSuccessComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute) { }
  data = {
    mensaje: '',
    folio: '',
    nombre: '',
    referencia: '',
    fecha: '',
    importe: '',
  };
  estatus = 1;
  ngOnInit(): void {
    console.log(window.location.hostname,window.location.href,window.location.pathname);
    this.activeRoute.queryParams
        .subscribe(params => {
          this.estatus = params?.estatus;
          this.data.mensaje = params?.mensaje;
          this.data.folio = params?.folio_oper;
          this.data.nombre = params?.nomUsuario;
          this.data.referencia = params?.referencia;
          this.data.fecha = `${params?.fecha} ${params?.hora}`;
          this.data.importe = params?.importe
        });
  }

}
