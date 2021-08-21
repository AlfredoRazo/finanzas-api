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
  data: any[] = [];

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }
    ngOnInit(): void {
      this.getSolicitudesServicios();
    
    }

    getSolicitudesServicios(): void{
      this.spinner.show();
      this.http.get(`${environment.endpointRecinto}solicitud/v1`).subscribe((res: any) => {
        if(!res.error){
          this.data = res.datos;
        }else{

        }
        console.log(res.error);
        this.spinner.hide();
      } ,err =>{this.spinner.hide();});
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
