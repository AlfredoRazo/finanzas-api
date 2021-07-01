import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-cfdi',
  templateUrl: './cfdi.component.html',
  styleUrls: ['./cfdi.component.css']
})
export class CfdiComponent implements OnInit {
  totalCFDI = 0;
  pageCFDI = 1;
  collSize = 10;
  originalDataCFDI: any[] = [];
  dataCFDI: any[] = [];
  filterDataCFDI: any[] = [];
  submenu = 1;
  fechaini = '';
  fechafin = '';
  desc = true;
  filtro = false;
  descPaginado = '';
  consulta = '';
  receptor = '';


  constructor(private http: HttpClient,
    private pagina: PaginateService,
    private help: HelpersService,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fechaini = this.help.today();
    this.fechafin = this.help.today();
    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaini = date } });
    $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechafin = date } });
    this.getCFDI();
  }

  getCFDI(): void {
    this.spinner.show();
    this.http.get(`${environment.endpointApi}cfdi?rfc=${this.auth.getSession().userData.rfc}&fechaini=${this.fechaini}&fechafin=${this.fechafin}`).subscribe((res: any) => {
      this.pageCFDI = 1;
      this.spinner.hide();
      this.totalCFDI = res[0].length;
      this.originalDataCFDI = [...res[0]];
      this.dataCFDI = this.pagina.paginate(res[0], 15, this.pageCFDI);
      this.descripcionPaginado();
    }, err => { this.spinner.hide() });
  }

  paginado(evt: any = null): void {
    if(this.filtro){
      this.dataCFDI = this.pagina.paginate(this.filterDataCFDI, 10, this.pageCFDI);
    }else{
      this.dataCFDI = this.pagina.paginate(this.originalDataCFDI, 10, this.pageCFDI);
    }
    this.descripcionPaginado();
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.totalCFDI + this.collSize - 1) / this.collSize);
    var start = (this.pageCFDI * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.totalCFDI);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }

  busqueda(): void {
    if (this.consulta === '' && this.receptor === '') {
      this.filtro = false;
      this.totalCFDI = this.originalDataCFDI.length;
      this.pageCFDI = 1;
      this.paginado();
    } else {
      this.filtro = true;
      this.filterDataCFDI = [...this.originalDataCFDI];
      if (this.consulta) {
        this.filterDataCFDI = this.filterDataCFDI.filter(element => {
          if (element.consulta.toLowerCase().includes(this.consulta.toLowerCase())) {
            return element;
          }
        });
      }
      if (this.receptor) {
        this.filterDataCFDI = this.filterDataCFDI.filter(element => {
          if (element.receptor.toLowerCase().includes(this.receptor.toLowerCase())) {
            return element;
          }
        });
      }
      this.totalCFDI = this.filterDataCFDI.length;
      this.pageCFDI = 1;
      this.paginado();

    }

  }

}
