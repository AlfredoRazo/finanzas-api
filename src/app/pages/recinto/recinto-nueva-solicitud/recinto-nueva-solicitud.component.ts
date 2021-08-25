import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@serv/auth.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-recinto-nueva-solicitud',
  templateUrl: './recinto-nueva-solicitud.component.html',
  styleUrls: ['./recinto-nueva-solicitud.component.css']
})
export class RecintoNuevaSolicitudComponent implements OnInit {
  manifiesto = '';
  page = 1;
  bl = '';
  bls: any[] = [];
  agenciasaduanales: any[] = [];
  agenciasconsig: any[] = [];
  lineasnavieras: any[] = [];
  agenciaAduanal = '';
  rfcCliente = '';
  nombreCliente: any;
  manifiestoData: any = [];
  public buque: any;
  buques: any[] = [];
  clientes: any[] = [];
  clientesRFC: any[] = [];
  msjConsulta = '';
  msjSuccess = '';
  msjError = '';
  tipoServ = '';
  tipoTram = '';
  tipoSoli = '';
  tipoTrans = '';
  fechaServ = '';
  fechaArribo = '';
  fechaInicioOp = '';
  fechaZarpe = '';
  patente = '';
  viaje = '';
  lineanaviera = '';
  agenciaconsig = '';
  nuevopeso = '';
  nuevacantidad = '';
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

  searchCliente: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.clientes.filter((v: any) => v.rfc.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  formatterCliente = (x: { rfc: string }) => x.rfc;

  searchClienteNombre: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.clientes.filter((v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  formatterClienteNombre = (x: { nombre: string }) => x.nombre;
  recintos: any[] = [];
  man: any = {};
  tipoSalida: any;
  recintoOrigen: string = '035';
  recintoDestino: any;
  tipoServicio = [
    { id: 1, descripcion: 'Contenedores' },
    { id: 2, descripcion: 'Carga suelta' }
  ];
  tipoTramite = [
    { id: 1, descripcion: 'Importación' },
    { id: 2, descripcion: 'Exportación' },
    { id: 3, descripcion: 'Transbordo' }
  ];
  tipoSolicitud = [
    { id: 1, descripcion: 'Entrada' },
    { id: 2, descripcion: 'Salida' },
    { id: 3, descripcion: 'Movimientos' },
    { id: 4, descripcion: 'Liberación' },
  ];
  medioTransporte = [
    { id: 1, descripcion: 'Carretero' },
    { id: 2, descripcion: 'Ferroviario' },
    { id: 3, descripcion: 'Marítimo' }
  ];

  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    public http: HttpClient) { }

  ngOnInit(): void {
    const user = this.auth.getSession().userData;
    this.getAgenciaAduanal();
    this.getBuques();
    this.getClientes();
    this.getAgenciaAduanal();
    this.getLineaNaviera();
    this.getAgenciaConsignataria();
    this.getRecinto();
    //this.agenciaAduanal = user.empresa;
    $('#fecha-servicio').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaServ = date } });
    $('#fecha-arribo').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaArribo = date } });
    $('#fecha-inicio-operaciones').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaInicioOp = date } });
    $('#fecha-zarpe').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaZarpe = date } });
  }

  consulta(): void {
    this.msjConsulta = '';
    this.spinner.show();
    this.http.get<any>(`${environment.endpointRecinto}bl/num/${this.bl}`).subscribe(res => {
      this.spinner.hide();
      if (!res.error) {
        this.bls.push(res.datos);
      } else {
        this.msjConsulta = res.mensaje;
      }
    }, error => {
      this.spinner.hide();
    })

  }

  searchName(): void {
    this.spinner.show();
    this.http.get<any>(environment.endpoint + 'clientes?rfc=' + this.rfcCliente).subscribe(res => {
      this.spinner.hide();
      this.nombreCliente = res.nombre;
    }, error => {
      this.spinner.hide();
    });
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
  getAgenciaAduanal(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
      //'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFjbGlAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiMjc1IiwiaWRBcHAiOiIxOCIsImlkUm9sIjoiNiIsImlkUm9sQXBwIjoiMTQwMSIsImlkUGVyc29uYSI6IjE3MTEiLCJpZEVtcHJlc2EiOiIxNCIsImlkQ29udHJhdG8iOiIxNDEiLCJuYmYiOjE2Mjk1MTQwNjEsImV4cCI6MTYyOTU0Mjg2MSwiaWF0IjoxNjI5NTE0MDYxLCJpc3MiOiJQSVMiLCJhdWQiOiJBUElNQU4ifQ.yHPNnEiz9WAcZ8mww3LWAZiAxmV3pPMDVtU-sUNRQyY`
    });
    //cambiar
    this.http.get('https://pis-catalogos-qa.azurewebsites.net/api/empresas/select/4', { headers: header }).subscribe((res: any) => {
      this.agenciasaduanales = res.valor;
    }, error => { });
  }
  getLineaNaviera(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
      //'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFjbGlAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiMjc1IiwiaWRBcHAiOiIxOCIsImlkUm9sIjoiNiIsImlkUm9sQXBwIjoiMTQwMSIsImlkUGVyc29uYSI6IjE3MTEiLCJpZEVtcHJlc2EiOiIxNCIsImlkQ29udHJhdG8iOiIxNDEiLCJuYmYiOjE2Mjk1MTQwNjEsImV4cCI6MTYyOTU0Mjg2MSwiaWF0IjoxNjI5NTE0MDYxLCJpc3MiOiJQSVMiLCJhdWQiOiJBUElNQU4ifQ.yHPNnEiz9WAcZ8mww3LWAZiAxmV3pPMDVtU-sUNRQyY`
    });
    //cambiar
    this.http.get('https://pis-catalogos-qa.azurewebsites.net/api/empresas/select/3', { headers: header }).subscribe((res: any) => {
      this.lineasnavieras = res.valor;
    }, error => { });
  }
  getRecinto(): void {
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/catRecintos`).subscribe((res: any) => {
      this.recintos = res;
    }, error => { });
  }
  getAgenciaConsignataria(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
      //'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFjbGlAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiMjc1IiwiaWRBcHAiOiIxOCIsImlkUm9sIjoiNiIsImlkUm9sQXBwIjoiMTQwMSIsImlkUGVyc29uYSI6IjE3MTEiLCJpZEVtcHJlc2EiOiIxNCIsImlkQ29udHJhdG8iOiIxNDEiLCJuYmYiOjE2Mjk1MTQwNjEsImV4cCI6MTYyOTU0Mjg2MSwiaWF0IjoxNjI5NTE0MDYxLCJpc3MiOiJQSVMiLCJhdWQiOiJBUElNQU4ifQ.yHPNnEiz9WAcZ8mww3LWAZiAxmV3pPMDVtU-sUNRQyY`
    });
    //cambiar
    this.http.get('https://pis-catalogos-qa.azurewebsites.net/api/empresas/select/1', { headers: header }).subscribe((res: any) => {
      this.agenciasconsig = res.valor;
    }, error => { });
  }

  getClientes(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}clientes`).subscribe((res: any) => {
      this.clientes = res[0];
      this.spinner.hide();
    }, error => { this.spinner.hide(); })

  }

  selected(evt: any): void {
    this.nombreCliente = evt.item;
    this.rfcCliente = evt.item;
  }

  addNuevosDatosBL(): void{
    const lastitem = {...this.bls[this.bls.length -1]};
    lastitem.cantidad = this.nuevacantidad;
    lastitem.pesoBruto = this.nuevopeso;
    this.bls.push(lastitem);
  }

  guardarSolicitud(): void {
    const user = this.auth.getSession().userData;
    const payload = {
      idEmpresa: +user.empresaid,
      idTipoServicio: +this.tipoServ,
      idTipoTramite: +this.tipoTram,
      idTipoSolicitud: +this.tipoSoli,
      idTipoTransporte: +this.tipoTrans,
      fechaServicio: this.fechaServ + 'T00:00:00.999Z',
      idAgenciaAduanal: +user.empresaid,
      patente: this.patente,
      idCliente: 0,
      nombre: this.nombreCliente?.nombre ? this.nombreCliente?.nombre : this.nombreCliente,
      buque: this.buque.nombre ? this.buque.nombre : this.buque,
      viaje: this.viaje,
      fechaArribo: this.fechaArribo + 'T00:00:00.999Z',
      fechaIniOperaciones: this.fechaInicioOp + 'T00:00:00.999Z',
      fechaZarpe: this.fechaZarpe + 'T00:00:00.999Z',
      idLineaNaviera: +this.lineanaviera,
      idAgenciaConsignataria: +this.agenciaconsig,
      idBl: +this.bls[0]?.id,
      estatus: 1
    };
    console.log(payload);
    this.msjSuccess = '';
    this.http.post(`${environment.endpointRecinto}solicitud/v1/`, payload).subscribe((res: any) => {
      if(!res.error){
        this.msjSuccess = res.mensaje;
      }else{

      }
    });
  }

}
