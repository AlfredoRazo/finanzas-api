import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bl-inventario',
  templateUrl: './bl-inventario.component.html',
  styleUrls: ['./bl-inventario.component.css']
})
export class BlInventarioComponent implements OnInit {
  bl: any;
  visualBL: any;
  blData:any;
  mensajeErr = '';
  constructor(
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  consulta(): void {
    this.mensajeErr = '';
    this.spinner.show();
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/consultarBl?BL=${this.bl}`).subscribe(res => {
      this.spinner.hide();
      if(res.length > 1){
        
        this.visualBL = res[0][0];
        console.log(this.visualBL);
      }else{
        this.visualBL = null;
        this.mensajeErr = 'No se encontró el BL';
      }
    });
  }

}
