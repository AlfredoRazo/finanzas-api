import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
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
  clientes: any[] = [];
  buque: any = {
    nombre: ''
  };
  buques: any[] = [];
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
    private spinner: NgxSpinnerService) { }
    search: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.buques.filter((v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  formatter = (x: { nombre: string }) => x.nombre;
  solicitados: any = {
    nombre : '',
    claveSAP: '',
  };
  facturaa: any= {
    nombre : '',
    claveSAP: '',
  };
  
  searchCliente: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.clientes.filter((v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );

  ngOnInit(): void {
    this.getData();
    this.getBuques();
    this.getClientes();
  }

  generarConsultaMode(consulta: any): void{
    this.numeroviaje = consulta.viaje;
    this.facturaa.nombre = consulta.facturara;
    this.buque.nombre = consulta.nombrebuque;
    this.solicitados.nombre = consulta.solicitante;
    this.isGenerarConsulta = true;
  }

  getData(): void {
    this.spinner.show();
    this.http.get(`${environment.endpointApi}buquesSolicitud`).subscribe((res: any) => {
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

  getClientes(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}clientes`).subscribe((res: any) => {
      this.clientes = res[0];
      this.spinner.hide();
    }, err => { this.spinner.hide() });
  }
  getBuques(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().userData.catToken}`
    });
    this.http.get(environment.endpointCat + 'buques', { headers: header }).subscribe((res: any) => {
      this.buques = res.valor;
    }, error => { });
  }

  generarConsulta(): void {
    this.spinner.show();
    const payload = {
      nombrebuque: this.buque.nombre ? this.buque.nombre : this.buque,
      solicitante: this.solicitados?.nombre ? this.solicitados?.nombre : this.solicitados,
      facturara: this.facturaa?.nombre ? this.facturaa?.nombre : this.facturaa,
      viaje: this.numeroviaje,
      rfc: this.auth.getSession()?.userData?.rfc
    } 

    this.http.post(`${environment.endpointApi}buquesSolicitud`, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res[0]?.error == 1) {
        this.hasError = true;
        this.success = false;
      } else {
        this.hasError = false
        this.success = true;
       // this.noConsulta = res[0].noConsulta;
       // this.data = [];
      }
    }, error => { this.spinner.hide(); });
  }
}
