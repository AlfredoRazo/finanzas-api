import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  filterDataClientes: any = [];
  pageClientes = 1;
  totalClientes = 0;
  collSize = 10;
  descPaginado = '';
  nombre = '';
  claveSap = '';
  rfc= '';
  filtro = false;
  detalleCliente: any;

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
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    this.http.get(`${environment.endpointEmpresas}api/Empresas/select`, { headers: header }).subscribe((res: any) => {
     
      this.spinner.hide();
      this.pageClientes = 1;
      this.totalClientes = res.valor.length;
      this.originalDataClientes = [...res.valor];
      this.dataClientes = this.pagina.paginate(res.valor, 10, this.pageClientes);
    }, error => {this.spinner.hide();})

  }

  getDetalleCliente(id: any): void{
    this.spinner.show();
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    this.http.get(`${environment.endpointEmpresas}api/Empresas/${id}`, { headers: header }).subscribe((res: any) => {
      this.spinner.hide();
      this.detalleCliente = res.datos;
      
    }, error => {this.spinner.hide();})

  }

  
  paginado(evt: any = null): void {
    if(this.filtro){
      this.dataClientes = this.pagina.paginate(this.filterDataClientes, 10, this.pageClientes);
    }else{
      this.dataClientes = this.pagina.paginate(this.originalDataClientes, 10, this.pageClientes);
    }
    this.descripcionPaginado();
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.totalClientes + this.collSize - 1) / this.collSize);
    var start = (this.pageClientes * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.totalClientes);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }

  busqueda(): void {
    if (this.nombre === '' && this.claveSap === '' && this.rfc === '') {
      this.filtro = false;
      this.totalClientes = this.originalDataClientes.length;
      this.pageClientes = 1;
      this.paginado();
    } else {
      this.filtro = true;
      this.filterDataClientes = [...this.originalDataClientes];
      /*if (this.claveSap) {
        this.filterDataClientes = this.filterDataClientes.filter( (element: any) => {
          if (element.claveSAP.toLowerCase().includes(this.claveSap.toLowerCase())) {
            return element;
          }
        });
      }*/
      if (this.nombre) {
        this.filterDataClientes = this.filterDataClientes.filter((element: any) => {
          if (element.valor.toLowerCase().includes(this.nombre.toLowerCase())) {
            return element;
          }
        });
      }
      /*if (this.rfc) {
        this.filterDataClientes = this.filterDataClientes.filter((element: any) => {
          if (element.rfc.toLowerCase().includes(this.rfc.toLowerCase())) {
            return element;
          }
        });
      }*/
      this.totalClientes = this.filterDataClientes.length;
      this.pageClientes = 1;
      this.paginado();

    }

  }
}
