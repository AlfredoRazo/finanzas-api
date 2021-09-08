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
  pedimentoSimplificado: BLFile = {} as BLFile;
  pedimentoCompleto: BLFile = {} as BLFile;
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
  idSolicitud: any;

  nuevacantidad: any;
  nuevopeso: any;
  hasErrorPesos = false;
  msjErrorpesos = '';
  hasSuccessBL = false;
  blmsj = '';
  tipoMov: any;
  pedSim: any;
  pedCom: any;
  blRev: any;
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
  liberacion: any[] = [];
  clavePedimento: any;
  tipoPedimento: any;
  numeroPartes: any;
  numeroCopias: any;
  cobe: any;
  numeroPedimento: any;
  tipoCambio: any;
  valorAduana: any;
  liberacionPiezas: any;
  liberacionPeso: any;

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

  tiposPedimentos = [
    { id: 1, descripcion: 'Normal' },
    { id: 2, descripcion: 'Parte 2' },
    { id: 3, descripcion: 'Copia Simple' },
    { id: 4, descripcion: 'Pedimento Consolidado' }
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
      'Authorization': `Bearer ${this.auth.getSession().token}`
    });
    this.http.get(environment.endpointCat + 'buques', { headers: header }).subscribe((res: any) => {
      this.buques = res.valor;
    }, error => { });
  }
  getAgenciaAduanal(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    this.http.get(`${environment.endpointCat}empresas/select/4`, { headers: header }).subscribe((res: any) => {
      this.agenciasaduanales = res.valor;
    }, error => { });
  }
  getLineaNaviera(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    environment.endpointCat
    //cambiar
    this.http.get(`${environment.endpointCat}empresas/select/3`, { headers: header }).subscribe((res: any) => {

      this.lineasnavieras = res.valor;
    }, error => { });
  }
  getPatente(): void {
    
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(environment.endpointCat + 'empresas/' + this.agenciaAduanal + '/patente', { headers: header }).subscribe((res: any) => {
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
    });
    //cambiar
    this.http.get(`${environment.endpointCat}empresas/select/1`, { headers: header }).subscribe((res: any) => {
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
      buque: this.buque?.nombre ? this.buque?.nombre : this.buque,
      viaje: this.viaje,
      fechaArribo: this.fechaArribo + 'T00:00:00.861Z',
      fechaIniOperaciones: this.fechaInicioOp + 'T00:00:00.861Z',
      fechaTerminoOperaciones: this.fechaTerminoOp + 'T00:00:00.861Z',
      fechaZarpe: this.fechaZarpe + 'T00:00:00.999Z',
      idLineaNaviera: +this.lineanaviera,
      idAgenciaConsignataria: +this.agenciaconsig,
      idBl: +this.bls[0]?.id,
      tipoMovimiento: this.tipoMov,
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
        if(+this.tipoSoli == 3){

          let payloadMov: any ={
            appkey: "046965ea2db6a892359ed2c4cd9f957b",
            usuario: this.auth.getSession().userData.username,
            BL: this.bls[0].bl,
            tipo: this.tipoMov,
            cantidad: 0,
            peso: 0,
            volumen: 0,
            fecha: this.fechaServ.split('-').reverse().join('-') + ' 00:00:00',
            documentos:[]
        };
          if(+this.tipoMov == 14){
            payloadMov.cantidad = this.bls[1].cantidad;
            payloadMov.peso = this.bls[1].pesoBruto;
          }else{
            if(this.blRevalidado.archivo){
              payloadMov.documentos.push({nombre: this.blRevalidado.nombre, archivo:this.blRevalidado.archivo});
            }
            if(this.solicitudFile.archivo){
              payloadMov.documentos.push({nombre: this.solicitudFile.nombre, archivo:this.solicitudFile.archivo});
            }
          }
          console.log(payloadMov);
          this.http.post('https://pis-api-recinto.azurewebsites.net/api/Movimientos',payloadMov).subscribe((res:any) => {},err =>{});
        }
        if (this.bls.length > 1) {
          const payload = {
            idSolicitud: res.valor,
            idBL: this.bls[1].id,
            cantidad: this.bls[1].cantidad,
            peso: this.bls[1].pesoBruto
          };
        
          this.http.post(`${environment.endpointRecinto}bl/movimiento`, payload).subscribe((res: any) => {
            if (!res.error) {

              this.hasSuccessBL = true;
              this.blmsj = res.mensaje;
            } else {
              this.hasSuccessBL = false;
              this.msjErrorpesos = res.mensaje;
              this.hasErrorPesos = true;
            }
          }, err => {
            this.msjErrorpesos = 'Ocurrio algo inesperado';
            this.hasErrorPesos = true;
          });
        }
      } else {

      }
    });
  }
  saveFiles(payload: BLFile): void {
    this.http.post(`${environment.endpointApi}recintoDocumentos`, payload).subscribe(res => {
    });
  }
  handleUpload(evt: any, name: string): void {

    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      switch (name) {
        case 'bl_revalidado':
          this.blRevalidado.nombre = name + '_' + evt.target.files[0].name;
          this.blRevalidado.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'tarja':
          this.tarja.nombre = name + '_' + evt.target.files[0].name;
          this.tarja.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'solicitud':
          this.solicitudFile.nombre = name + '_' + evt.target.files[0].name;
          this.solicitudFile.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'pedimento_simplificado':
          this.pedimentoSimplificado.nombre = name + '_' + evt.target.files[0].name;
          this.pedimentoSimplificado.archivo = reader.result?.toString().split(',')[1];
          break;
        case 'pedimento_completo':
          this.pedimentoCompleto.nombre = name + '_' + evt.target.files[0].name;
          this.pedimentoCompleto.archivo = reader.result?.toString().split(',')[1];
          break;
        default:
          break;
      }
    };
  }
  addNuevosDatosBL(): void {
    let err = 0;
    const lastitem = { ...this.bls[0] };
    if (parseInt(lastitem.cantidad) < parseInt(this.nuevacantidad)) {
      err++;
    }
    if (parseFloat(lastitem.pesoBruto) < parseFloat(this.nuevopeso)) {
      err++;
    }
    if (err == 0) {
      lastitem.cantidad = this.nuevacantidad;
      lastitem.pesoBruto = this.nuevopeso;
      this.bls.push(lastitem);


    } else {
      this.msjErrorpesos = 'La cantidad de salida o el peso de salida no pueden ser mayores';
      this.hasErrorPesos = true;
    }
  }
  addLiberacion(): void {
    this.liberacion.push(
      {
        pedimentoSimplificado: this.pedimentoSimplificado,
        pedimentoCompleto: this.pedimentoCompleto,
        blRevalidado: this.blRevalidado,
        clavePedimento: this.clavePedimento,
        tipoPedimento: this.tipoPedimento,
        numeroPedimento: this.numeroPedimento,
        tipoCambio: this.tipoCambio,
        valorAduana: this.valorAduana,
        piezas: this.liberacionPiezas,
        peso: this.liberacionPeso,
        numPartes: this.numeroPartes,
        numCopias: this.numeroCopias,
        cobe: this.cobe
      }
    );
    this.pedimentoSimplificado = {} as BLFile;
    this.pedimentoCompleto = {} as BLFile;
    this.blRevalidado = {} as BLFile;
    this.clavePedimento = null;
    this.tipoPedimento = null;
    this.numeroPedimento = null;
    this.tipoCambio = null;
    this.valorAduana = null;
    this.liberacionPiezas = null;
    this.liberacionPeso = null;
    this.numeroPartes = null;
    this.numeroCopias = null;
    this.cobe = null;
    this.pedCom = null;
    this.pedSim = null;
    this.blRev = null;
  }

}
