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
  originalDataCFDI: any[] = [];
  dataCFDI: any[] = [];
  submenu = 1;
  fechaini = '';
  fechafin = '';
  desc = true;


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
    }, err => { this.spinner.hide() });
  }

  paginado(page: any, key = null): void {
    this.dataCFDI = this.pagina.paginate(this.originalDataCFDI, 10, this.pageCFDI);
  }

}
