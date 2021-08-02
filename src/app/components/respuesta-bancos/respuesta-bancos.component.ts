import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
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
    private pagina: PaginateService,
    private spinner: NgxSpinnerService,
    private help: HelpersService
  ) { }

  data: any[] = [];
  originalData: any[] = [];
  total = 0;
  page = 1;
  collSize = 10;
  fechaini = this.help.today();
  fechafin = this.help.today();
  descPaginado = '';
  ngOnInit(): void {
    this.getData();
    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaini = date } });
    $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechafin = date } });
  }

  getData() {
    this.spinner.show();
    this.http.get(`${environment.endpointApi}bancosRespuesta?fechainicial=${this.fechaini}&fechafinal=${this.fechafin}`)
      .subscribe((res: any) => {
       if(Array.isArray(res[0])){
        this.total = res[0].length;
        this.originalData = [...res[0]];
        this.data = this.pagina.paginate(res[0], this.collSize, this.page);
       }
        this.spinner.hide();
      }, (error) => {this.spinner.hide(); });
  }
  paginado(evt: any = null): void {

      this.data = this.pagina.paginate(this.originalData, 10, this.page);
    this.descripcionPaginado();
  }
  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.total + this.collSize - 1) / this.collSize);
    var start = (this.page * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.total);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }

}
