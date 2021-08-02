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
  catCFDI: any[] = [];
  sendCFDI = false;
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
  cfdi: any;
  ngOnInit(): void {
    this.getCatalogoCFDI();
    this.activeRoute.queryParams
      .subscribe(params => {
            let valores = '';
            Object.entries(params).forEach(item => {
              valores += `${item[0]}:${item[0]}|`
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
            this.http.post(`${environment.endpointApi}bancosRespuesta`, this.data).subscribe((resBanco: any) => {
            });
      });
  }

  getCatalogoCFDI(): void{
    this.http.get(`${environment.endpointApi}catUsoCFDI`).subscribe((res: any)=> {
      this.catCFDI = res;
    });
  }

  sendUsoCfdi(): void{
    const val = this.catCFDI.filter(item =>{ return item.clave === this.cfdi });
    const payload = {
      appkey : environment.appKey,
      referencia:this.data.referencia,
      clave: val[0].clave,
      uso: val[0].valor
    }
    this.http.post(`${environment.endpointApi}catUsoCFDI`, payload).subscribe((res: any)=>{
      if(res.error == 0){
        this.sendCFDI = true;
      }
    },error=>{});
  }

}
