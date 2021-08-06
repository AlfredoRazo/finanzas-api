import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-bancomer10',
  templateUrl: './bancomer10.component.html',
  styleUrls: ['./bancomer10.component.css']
})
export class Bancomer10Component implements OnInit {

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
  cfdi: any;
  ngOnInit(): void {
    this.getCatalogoCFDI();
    this.activeRoute.queryParams
      .subscribe(params => {
            let valores = '';
            Object.entries(params).forEach(item => {
              valores += `${item[0]}:${item[0]}|`
            })
            this.estatus = params?.estatus;
            this.data.estatus = '9';
            this.data.mensaje = 'TransaccionOK';
            this.data.folio = params?.s_transm;
            this.data.nombre = params?.val_2;
            this.data.referencia = params?.c_referencia;
            this.data.valores = valores;
            this.data.fecha = `${params?.val_10}`;
            this.data.importe = params?.t_importe;
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
