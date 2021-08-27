import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@serv/auth.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var $: any;
export interface BLFile {
  bl: string;
  nombre: string;
  archivo: string | undefined;
}
@Component({
  selector: 'app-recinto-nueva-solicitud',
  templateUrl: './recinto-nueva-solicitud.component.html',
  styleUrls: ['./recinto-nueva-solicitud.component.css']
})
export class RecintoNuevaSolicitudComponent implements OnInit {
  manifiesto = '';
  page = 1;
  bl = '';
  blRevalidado: BLFile = {} as BLFile;
  tarja: BLFile = {} as BLFile;
  solicitudFile: BLFile = {} as BLFile;
  infoRelativa = false;
  patentes: any[] = [];
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
  fechaTerminoOp = '';
  fechaZarpe = '';
  patente = '';
  viaje = '';
  lineanaviera = '';
  agenciaconsig = '';

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
    $('#fecha-servicio').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaServ = date } });
    $('#fecha-arribo').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaArribo = date } });
    $('#fecha-inicio-operaciones').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaInicioOp = date } });
    $('#fecha-termino-operaciones').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaTerminoOp = date } });
    $('#fecha-zarpe').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaZarpe = date } });
  }

  consulta(): void {
    this.msjConsulta = '';
    this.spinner.show();
    this.http.get<any>(`${environment.endpointRecinto}bl/num/${this.bl}`).subscribe(res => {
      this.spinner.hide();
      if (!res.error) {
        this.bls[0] = res.datos;
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
  getPatente(): void {
    console.log(this.agenciaAduanal);
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
      //'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiMjY4IiwiaWRBcHAiOiIwIiwiaWRSb2wiOiI2IiwiaWRSb2xBcHAiOiIwIiwiaWRQZXJzb25hIjoiMTcxMSIsImlkRW1wcmVzYSI6IjE0IiwiaWRDb250cmF0byI6IjE0MSIsIm5iZiI6MTYyOTk0MjkwMSwiZXhwIjoxNjI5OTcxNzAxLCJpYXQiOjE2Mjk5NDI5MDEsImlzcyI6IlBJUyIsImF1ZCI6IkFQSU1BTiJ9.T5PQTu8kOhfAGIkpdYarEXmuh_Zb_u6cz9wnHvX7id4`
    });
    //cambiar
    this.http.get('https://pis-catalogos-qa.azurewebsites.net/api/Empresas/' + this.agenciaAduanal + '/patente', { headers: header }).subscribe((res: any) => {
      this.patente = res.valor[0];
      this.patentes = res.valor;
    }, error => { });
  }
  getRecinto(): void {
    this.http.get(`${environment.endpointApi}catRecintos`).subscribe((res: any) => {
      this.recintos = res;
    }, error => {
      console.log(error);
    });
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
      fechaArribo: this.fechaArribo + 'T00:00:00.861Z',
      fechaIniOperaciones: this.fechaInicioOp + 'T00:00:00.861Z',
      fechaTerminoOperaciones: this.fechaTerminoOp + 'T00:00:00.861Z',
      fechaZarpe: this.fechaZarpe + 'T00:00:00.999Z',
      idLineaNaviera: +this.lineanaviera,
      idAgenciaConsignataria: +this.agenciaconsig,
      idBl: +this.bls[0]?.id,
      estatus: 1,
      violacionDañoAlmacenado: this.infoRelativa
    };
    this.blRevalidado.bl = this.bls[0].bl;
    this.tarja.bl = this.bls[0].bl;
    this.solicitudFile.bl = this.bls[0].bl;
    this.msjSuccess = '';
    if (this.blRevalidado.archivo) { this.saveFiles(this.blRevalidado); }
    if (this.tarja.archivo) { this.saveFiles(this.tarja); }
    if (this.solicitudFile.archivo) { this.saveFiles(this.solicitudFile); }


    this.http.post(`${environment.endpointRecinto}solicitud/v1/`, payload).subscribe((res: any) => {
      if (!res.error) {
        this.msjSuccess = res.mensaje + ' Solicitud:' + res.valor;
      } else {

      }
    });
  }
  saveFiles(payload: BLFile): void {
    this.http.post(`${environment.endpointApi}recintoDocumentos`, payload).subscribe(res => {
      console.log(res);
    });
  }
  handleUpload(evt: any, name: string): void {

    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      switch (name) {
        case 'bl_revalidado':
          this.blRevalidado.nombre = evt.target.files[0].name;
          this.blRevalidado.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'tarja':
          this.tarja.nombre = evt.target.files[0].name;
          this.tarja.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'solicitud':
          this.solicitudFile.nombre = evt.target.files[0].name;
          this.solicitudFile.archivo = reader.result?.toString().split(',')[1];
          break;

        default:
          break;
      }
    };
  }

}
