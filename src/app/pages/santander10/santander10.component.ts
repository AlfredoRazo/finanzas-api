import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { FinanzasService } from '@serv/finanzas.service';

@Component({
  selector: 'app-santander10',
  templateUrl: './santander10.component.html',
  styleUrls: ['./santander10.component.css']
})
export class Santander10Component implements OnInit {
  catCFDI: any[] = [];
  sendCFDI = false;
  constructor(private activeRoute: ActivatedRoute, private http: HttpClient, private auth: AuthService, private httpf: FinanzasService,) { }
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
  cfdi: any;
  ngOnInit(): void {
    this.getCatalogoCFDI();
    this.activeRoute.queryParams
      .subscribe(params => {
        let valores = '';
        Object.entries(params).forEach(item => {
          valores += `${item[0]}:${item[1]}|`
        })
        this.type = 1;
        this.estatus = params?.estatus;
        this.data.estatus = params?.estatus;
        this.data.mensaje = params?.mensaje;
        this.data.folio = params?.folio_oper;
        this.data.nombre = params?.nomUsuario;
        this.data.referencia = params?.referencia;
        this.data.valores = valores;
        this.data.fecha = `${params?.fecha} ${params?.hora}`;
        this.data.importe = params?.importe;
        let apiid = this.auth.getSession().userData.idAPI;

        this.httpf.post(`bancosRespuesta?idAPI=${apiid}`, this.data).subscribe((resBanco: any) => {
        });
      });
  }

  getCatalogoCFDI(): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.httpf.get(`catUsoCFDI?idAPI=${apiid}`).subscribe((res: any) => {
      this.catCFDI = res;
    });
  }

  sendUsoCfdi(): void {
    const val = this.catCFDI.filter(item => { return item.clave === this.cfdi });
    const payload = {
      appkey: environment.appKey,
      referencia: this.data.referencia,
      clave: val[0].clave,
      uso: val[0].valor
    }
    let apiid = this.auth.getSession().userData.idAPI;
    this.httpf.post(`catUsoCFDI?idAPI=${apiid}`, payload).subscribe((res: any) => {
      if (res.error == 0) {
        this.sendCFDI = true;
      }
    }, error => { });
  }

}
