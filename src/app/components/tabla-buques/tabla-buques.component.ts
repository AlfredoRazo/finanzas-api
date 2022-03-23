import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { FinanzasService } from '@serv/finanzas.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-tabla-buques',
  templateUrl: './tabla-buques.component.html',
  styleUrls: ['./tabla-buques.component.css']
})
export class TablaBuquesComponent implements OnInit {
  totalData = 0;
  pageData = 1;
  collSize = 10;
  originalData: any[] = [];
  data: any[] = [];
  filterData: any[] = [];
  filtro = false;
  descPaginado = '';
  isGenerarConsulta = false;
  hasError  = false;
  success = false;
  numeroviaje = '';
  rfc = '';
  constructor(private http: HttpClient,
    private pagina: PaginateService,
    private help: HelpersService,
    private auth: AuthService,
    private httpf: FinanzasService,
    private spinner: NgxSpinnerService) { }
  
  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    this.httpf.get(`buquesSolicitud?idAPI=${apiid}`).subscribe((res: any) => {
      this.pageData = 1;
      this.spinner.hide();
      this.totalData = res.length;
      this.originalData = [...res];
      this.data = this.pagina.paginate(res, 15, this.pageData);
      this.descripcionPaginado();
    }, err => { this.spinner.hide() });
  }
  paginado(evt: any = null): void {
    if(this.filtro){
      this.data = this.pagina.paginate(this.filterData, 10, this.pageData);
    }else{
      this.data = this.pagina.paginate(this.originalData, 10, this.pageData);
    }
    this.descripcionPaginado();
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.totalData + this.collSize - 1) / this.collSize);
    var start = (this.pageData * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.totalData);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }
}
