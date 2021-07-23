import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { HelpersService } from '@serv/helpers.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-clientes-table',
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.css']
})
export class ClientesTableComponent implements OnInit {

  dataClientes: any = [];
  originalDataClientes: any = [];
  pageClientes = 1;
  totalClientes = 0;
  collSize = 10;
  descPaginado = '';

  constructor(private http: HttpClient,
    private pagina: PaginateService,
    private help: HelpersService,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getClientes();
  }
  getClientes(): void{
    this.spinner.show();
    this.http.get(`${environment.endpoint}clientes`).subscribe((res: any) => {
      this.spinner.hide();
      this.pageClientes = 1;
      this.totalClientes = res[0].length;
      this.originalDataClientes = [...res[0]];
      this.dataClientes = this.pagina.paginate(res[0], 10, this.pageClientes);
    }, error => {this.spinner.hide();})

  }
  paginado(evt: any = null): void {
      this.dataClientes = this.pagina.paginate(this.originalDataClientes, 10, this.pageClientes);
 
    this.descripcionPaginado();
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.totalClientes + this.collSize - 1) / this.collSize);
    var start = (this.pageClientes * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.totalClientes);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }
}
