import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-respuesta-bancos',
  templateUrl: './respuesta-bancos.component.html',
  styleUrls: ['./respuesta-bancos.component.css']
})
export class RespuestaBancosComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  data: any[] = [];
  fechaini: any;
  fechafin: any;
  
  ngOnInit(): void {
    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaini = date } });
    $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechafin = date } });
  }

  getData() {
    this.spinner.show();
    this.http.get(`${environment.endpointApi}bancosRespuesta?fechainicial=${this.fechaini}&fechafinal=${this.fechafin}`)
      .subscribe((res: any) => {
        this.data = res[0];
        this.spinner.hide();
      }, (error) => {this.spinner.hide(); });
  }

}
