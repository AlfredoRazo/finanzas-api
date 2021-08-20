import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.css']
})
export class RecintoComponent implements OnInit {
  manifiesto = '';
  manifiestoData:any;
  submenu = 1;
  page = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      cliente: 'La junta',
      tipoSolicitud: 'Pago de aranceles',
      estado: 'Pendiente'
    }
  ];

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }
    ngOnInit(): void {
    
    }

    consultarManifiesto(): void{
      this.spinner.show();
      this.http.get(`${environment.endpointRecinto}manifiesto/v1/num/${this.manifiesto}`).subscribe((res: any) =>{
        this.manifiestoData = res.datos;
        this.spinner.hide();
      },err=>{
        this.spinner.hide();
      });
    }
}
