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
  blsdesc: any[] = [];
  agenciasaduanales: any[] = [];
  agenciasconsig: any[] = [];
  lineasnavieras: any[] = [];
  agenciaAduanal: any;
  rfcCliente: any;
  msjerror = '';
  nombreCliente: any;
  manifiestoData: any = [];
  public buque: any;
  buques: any[] = [];
  msjWarn = '';
  clientes: any[] = [];
  clientesRFC: any[] = [];
  cliente: any;
  clienteDetalle: any;
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
  pesoDisponible = 0;
  cantidadDisponible = 0;
  isSeparacion = false;
  lineanaviera: any;
  agenciaconsig: any;
  idSolicitud: any;
  blmovimiento: any = [];
  blliber: any[] = [];
  restantes: any;
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
  restanteCheck = false;
  checkeddis = false;
  clavesPedimento: any[] = [];
  indexBl: any;
  indexLib: any;
  buscarEmp = '';
  cantidadSalida = '';
  pesoSalida = '';
  blsalida:any [] = [];
  ismultiplebl = false;
  multiplebl:any;
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
  cove: any;
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
  totalPesoSalida = 0;
  totalCantidadSalida = 0;
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
    //this.getBuques();
    //this.getClientes();
    this.getLineaNaviera();
    this.getAgenciaConsignataria();
    this.getRecinto();
    this.getClavePedimentos();
    $('#fecha-servicio').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaServ = date } });
    $('#fecha-arribo').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaArribo = date } });
    $('#fecha-inicio-operaciones').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaInicioOp = date } });
    $('#fecha-termino-operaciones').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaTerminoOp = date } });
    $('#fecha-zarpe').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaZarpe = date } });
  }

  consulta(): void {
    this.msjConsulta = '';
    this.msjWarn = '';
    this.bls = [];
    this.buque = '';
    this.viaje = '';
    this.spinner.show();
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/consultarBl?BL=${this.bl}`).subscribe(res => {
      this.spinner.hide();
      if (!res.error) {
        if (res[0][0]) {
          this.bls = res[0];
          console.log(this.bls);
          if (this.bls[0].estatus || this.tipoSoli == '1') {
            this.ismultiplebl = this.bls.length > 1;
            if(this.ismultiplebl){
              this.bls = [];
              this.bls.push(res[0][0]);
              this.blsdesc = res[0];
            }
            this.buque = this.bls[0]?.buque;
            this.viaje = this.bls[0]?.viaje;
            this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudLiberacion?Referencia=${this.bl}`).subscribe(resP => {
              if(!resP[0].error){
                this.blliber = resP[0];
              }
            }, error => {
            });
            this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudSalida?referencia=${this.bl}`).subscribe(res => {
              if (res.length == 3) {
                this.blsalida = res[0];
              }
              if (res.length == 2) {
                this.blsalida = res[0];
              }
                this.blsalida.forEach(item =>{
                  this.totalCantidadSalida += item.salidaCantidad;
                  this.totalPesoSalida += item.salidaPeso;
                });
                this.totalCantidadSalida =  this.bls[0]?.cantidad -this.totalCantidadSalida;
                this.totalPesoSalida = this.bls[0]?.pesoBruto - this.totalPesoSalida;
            }, error => {
              this.blsalida = [];
            });
            this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/Movimientos?tipoMovimiento=Separación&BL=${this.bl}`).subscribe(res => {
              if (res.length > 2) {
                this.cantidadDisponible = res[0].disponibleCantidad;
                this.pesoDisponible = res[0].disponiblePeso;
                this.restantes = res[0];
                this.isSeparacion = true;
                this.tipoMov = '14';
                this.blmovimiento = res[1].map((item: any) => {
                  item.selected = false;
                  return item;
                });
              } else {
                this.isSeparacion = false;
                this.blmovimiento = [];
              }
            }, error => {
            });
          } else {
            this.bls = [];
            this.msjWarn = 'No hay entradas autorizadas';
          }
        }
      } else {
        this.bls = [];
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
  selectbl(): void{
    this.buque = this.multiplebl?.buque;
    this.viaje = this.multiplebl?.viaje;
    this.bls = [];
    this.bls.push(this.multiplebl);
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudSalida?referencia=${this.bl}`).subscribe(res => {
      if (res.length == 3) {
        this.blsalida = res[0];
      }
      if (res.length == 2) {
        this.blsalida = res[0];
      }
        this.blsalida.forEach(item =>{
          this.totalCantidadSalida += item.salidaCantidad;
          this.totalPesoSalida += item.salidaPeso;
        });
        this.totalCantidadSalida =  this.bls[0]?.cantidad -this.totalCantidadSalida;
        this.totalPesoSalida = this.bls[0]?.pesoBruto - this.totalPesoSalida;
    }, error => {
      this.blsalida = [];
    });
    //this.bls = [...this.multiplebl]
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

    this.http.get(`${environment.endpointEmpresas}api/empresas/select/38`, { headers: header }).subscribe((res: any) => {
      this.agenciasaduanales = res.datos;
      this.agenciaAduanal = +this.auth.getSession().userData.empresaid;
      this.getPatente();
    }, error => { });
  }
  getLineaNaviera(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    environment.endpointCat
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas/select/45`, { headers: header }).subscribe((res: any) => {

      this.lineasnavieras = res.datos;
    }, error => { });
  }

  getPatente(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    
    this.http.get(`${environment.endpointEmpresas}api/empresas/${this.agenciaAduanal.id}/patente`, { headers: header }).subscribe((res: any) => {
      if(res.valor){
        this.patentes = res.valor;
      }
    }, error => { });
  }
  getRecinto(): void {
    let apiid = this.auth.getSession().userData.idAPI;
    
    this.http.get(`${environment.endpointApi}catRecintos?idAPI=${apiid}`).subscribe((res: any) => {
      this.recintos = res;
    }, error => {

    });
  }
  getAgenciaConsignataria(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas/select/41`, { headers: header }).subscribe((res: any) => {
      this.agenciasconsig = res.datos;
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
    this.msjSuccess = '';
    this.msjError = '';
    const payload = {
      appkey: '046965ea2db6a892359ed2c4cd9f957b',
      solicitudDatos: [
        {
          idEmpresa: +user.empresaid,
          idCliente: this.clienteDetalle?.id,
          idTipoServicio: +this.tipoServ,
          idTipoTramite: +this.tipoTram,
          idTipoSolicitud: +this.tipoSoli,
          idTipoTransporte: +this.tipoTrans,
          fechaServicio: this.fechaServ.split('-').reverse().join('-') + ' 00:00:00',
          idAgenciaAduanal: +this.agenciaAduanal.id,
          patente: this.patente,
          rfc: this.clienteDetalle?.rfc,
          nombreAgenciaAduanal: this.agenciaAduanal.valor,
          cliente: this.clienteDetalle?.nombre,
          nombre: this.clienteDetalle?.nombre,
          buque: this.buque?.nombre ? this.buque?.nombre : this.buque,
          viaje: this.viaje,
          fechaArribo: this.fechaArribo.split('-').reverse().join('-') + ' 00:00:00',
          fechaIniOperaciones: this.fechaInicioOp.split('-').reverse().join('-') + ' 00:00:00',
          fechaZarpe: this.fechaZarpe.split('-').reverse().join('-') + ' 00:00:00',
          fechaTermOperaciones: this.fechaTerminoOp.split('-').reverse().join('-') + ' 00:00:00',
          idLineaNaviera: +this.lineanaviera.id,
          idAgenciaConsignataria: +this.agenciaconsig.id,
          lineaNaviera: this.lineanaviera.valor,
          agenciaConsignataria: this.agenciaconsig.valor,
          idBl: +this.bls[0]?.idBL,
          danyoExtravio: this.infoRelativa ? 1 : 0,
          idUsuAlta: +user.idusuario,
          UsuAlta: user.username
        }
      ]
    };
    
    if((this.tipoSoli == '2' && this.tipoSalida == '91') && (this.indexLib != undefined && this.blliber.length > 0)){
      if(this.pesoSalida != this.blliber[this.indexLib].solicitudPeso && this.cantidadSalida != this.blliber[this.indexLib].solicitudPiezas){
      this.msjErrorpesos = 'La cantidad de salida ó el peso de salida debe ser igual al peso ó salida de la liberación';
      this.hasErrorPesos = true;
      return;
      }
    }
    if(this.tipoSoli == '2' && (+this.cantidadSalida > this.totalCantidadSalida || +this.pesoSalida > this.totalPesoSalida)){
      this.msjErrorpesos = 'La cantidad de salida o el peso de salida no pueden ser mayores a lo sobrante';
      this.hasErrorPesos = true;
      return;
    }
    this.http.post(`https://pis-api-recinto.azurewebsites.net/api/solicitudes`, payload).subscribe((resSolicitudF: any) => {

      if (!resSolicitudF.error) {
        this.msjSuccess = 'Se guardó correctamente con número de solicitud: ' + resSolicitudF.message;
        switch (+this.tipoSoli) {
          case 2:
            this.spinner.show();
            let liberacionId = 0
            if(this.tipoSalida == '91'){
              liberacionId = this.blliber.length > 0 ? this.blliber[this.indexLib].solicitudId : 0;
            }
            let payloadSalida: any = {
              appkey: "046965ea2db6a892359ed2c4cd9f957b",
              salidas: [
                {
                  usuario: this.auth.getSession().userData.username,
                  BL: this.bls[0].bl,
                  tipoSalida: this.tipoSalida,
                  recintoOrigen: this.recintoOrigen,
                  recintoDestino: this.recintoDestino,
                  idSolicitud: resSolicitudF.message,
                  liberacionId: liberacionId,
                  docPedimentoSimplificado: this.blRevalidado,
                  docSolicitud: this.solicitudFile,
                  docTarja: this.tarja,
                  cantidad: +this.cantidadSalida,
                  peso: +this.pesoSalida
                }
              ]

            };
            this.http.post('https://pis-api-recinto.azurewebsites.net/api/solicitudSalida', payloadSalida).subscribe((resmo: any) => { this.spinner.hide(); }, err => { this.spinner.hide();});
            break;
          case 3:
            this.spinner.show();
            let payloadMov: any = {
              appkey: "046965ea2db6a892359ed2c4cd9f957b",
              usuario: this.auth.getSession().userData.username,
              BL: this.bls[0].bl,
              tipo: this.tipoMov,
              cantidad: 0,
              peso: 0,
              volumen: 0,
              idSolicitud: resSolicitudF.message,
              fecha: this.fechaServ.split('-').reverse().join('-') + ' 00:00:00',
              documentos: []
            };
            if (+this.tipoMov == 14) {
              payloadMov.cantidad = this.bls[1].cantidad;
              payloadMov.peso = this.bls[1].pesoBruto;
            } else {
              if (this.blRevalidado.archivo) {
                payloadMov.documentos.push({ nombre: this.blRevalidado.nombre, archivo: this.blRevalidado.archivo });
              }
              if (this.solicitudFile.archivo) {
                payloadMov.documentos.push({ nombre: this.solicitudFile.nombre, archivo: this.solicitudFile.archivo });
              }
            }

            this.http.post('https://pis-api-recinto.azurewebsites.net/api/Movimientos', payloadMov).subscribe((resmo: any) => {this.spinner.hide(); }, err => { this.spinner.hide();});
            break;
          case 4:
            this.spinner.show();
            let liber = this.liberacion.map(item => {
              item.idSolicitud = resSolicitudF.message;
              return item;
            });
            const payloadLib = {
              appkey: "046965ea2db6a892359ed2c4cd9f957b",
              liberaciones: liber
            };
            this.http.post('https://pis-api-recinto.azurewebsites.net/api/solicitudLiberacion', payloadLib).subscribe((resLib: any) => { this.spinner.hide();
            }, err => { this.spinner.hide(); });
            break;
        }
      } {

        this.msjError = resSolicitudF.message

      }
    });

  }

  saveFiles(payload: BLFile): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.post(`${environment.endpointApi}recintoDocumentos?idAPI=${apiid}`, payload).subscribe(res => {
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
    let pesocomp = this.isSeparacion ? this.pesoDisponible : parseFloat(lastitem.pesoBruto);
    let cantidadComp = this.isSeparacion ? this.cantidadDisponible : parseInt(lastitem.cantidad);
    if (cantidadComp < parseInt(this.nuevacantidad)) {
      err++;
    }
    if (pesocomp < parseFloat(this.nuevopeso)) {
      err++;
    }
    if (err == 0) {
      lastitem.cantidad = this.nuevacantidad;
      lastitem.pesoBruto = this.nuevopeso;
      this.bls.push(lastitem);
    } else {
      let extra = this.isSeparacion ? ' Cantidad Disponible : ' + this.cantidadDisponible + ' Peso Disponible : ' + this.pesoDisponible : '';
      this.msjErrorpesos = 'La cantidad de salida o el peso de salida no pueden ser mayores' + extra;
      this.hasErrorPesos = true;
    }
  }

  salidaLiberacion(){
    this.pesoSalida = this.blliber[this.indexLib].solicitudPeso;
    this.cantidadSalida = this.blliber[this.indexLib].solicitudPiezas;
  }

  addLiberacion(): void {
    this.msjErrorpesos = '';
    this.hasErrorPesos = false;
    let error = 0;
    if (this.blmovimiento.length > 0) {
      if (this.indexBl == -1) {
        if (parseInt(this.restantes.disponibleCantidad) > parseInt(this.liberacionPiezas)) {
          error++;
        }
        if (parseFloat(this.restantes.disponiblePeso) > parseFloat(this.liberacionPeso)) {
          error++;
        }
      } else {
        if (this.liberacion.length > 0) {
          let totalCant = 0
          let totalPeso = 0;
          this.liberacion.forEach(item => {
            totalCant = totalCant + item.piezas;
            totalPeso = totalPeso + item.peso;
          });
          if (parseInt(this.liberacionPiezas) > totalCant) {
            error++;
          }
          if (parseFloat(this.liberacionPeso) > totalPeso) {
            error++;
          }

        } else {
          if (parseInt(this.blmovimiento[this.indexBl].movimientoCant) < parseInt(this.liberacionPiezas)) {
            error++;
          }
          if (parseFloat(this.blmovimiento[this.indexBl].movimientoPeso) < parseFloat(this.liberacionPeso)) {
            error++;
          }
        }

      }
    } else {
      if (parseInt(this.bls[0].cantidad) < parseInt(this.liberacionPiezas)) {
        error++;
      }
      if (parseFloat(this.bls[0].pesoBruto) < parseFloat(this.liberacionPeso)) {
        error++
      }

    }
    if (error > 0) {
      this.msjErrorpesos = 'La cantidad de liberación del peso de salida no pueden ser mayores';
      this.hasErrorPesos = true;
    } else {
      let movimientoid = 0;
      let tipoliberacion = 0;
      if (this.blmovimiento.length > 0) {
        movimientoid = this.indexBl == -1 ? 999 : this.blmovimiento[this.indexBl].movimientoId;
        tipoliberacion = this.indexBl == -1 ? 1 : 2;
      } else {
        tipoliberacion = 3;
      }
      if (!this.pedimentoSimplificado.archivo) {
        this.msjErrorpesos = 'El archivo pedimento simplificado es requerido';
        this.hasErrorPesos = true;
        return;
      }
      if (!this.pedimentoCompleto.archivo) {
        this.msjErrorpesos = 'El archivo pedimento completo es requerido';
        this.hasErrorPesos = true;
        return;
      }
      if (!this.blRevalidado.archivo) {
        this.msjErrorpesos = 'El archivo bl revalidado es requerido';
        this.hasErrorPesos = true;
        return;
      }
      this.liberacion.push(
        {
          usuario: this.auth.getSession().userData.username,
          BL: this.bls[0].bl,
          piezas: parseInt(this.liberacionPiezas),
          peso: parseFloat(this.liberacionPeso),
          clavePedimento: this.clavePedimento,
          tipoPedimento: this.tipoPedimento,
          numeroPedimento: this.numeroPedimento,
          tipoCambio: this.tipoCambio,
          valorAduana: this.valorAduana,
          movimientoId: movimientoid,
          TipoLiberacion: tipoliberacion,
          docPedimentoSimplificado: this.pedimentoSimplificado,
          docPedimentoCompleto: this.pedimentoCompleto,
          documentoBLRevalidado: this.blRevalidado,
          numeroPartes: this.numeroPartes ? this.numeroPartes : 0,
          numeroCopias: this.numeroCopias ? this.numeroCopias : 0,
          cove: this.cove ? this.cove : 0
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
      this.cove = null;
      this.pedCom = null;
      this.pedSim = null;
      this.blRev = null;
    }

  }

  getClavePedimentos(): void {
    this.http.get('https://pis-api-recinto.azurewebsites.net/api/catalogos?catalogo=pedimentos').subscribe((res: any) => {
      this.clavesPedimento = res[0];
    }, err => { });
  }
  buscarEmpresa(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas?buscar=${this.buscarEmp}&orden=idEmpresa&tipo_orden=ASC&pagina=1&registros_por_pagina=10`, { headers: header }).subscribe((res: any) => {
      if (!res.error) {
        this.clientes = res.valor?.resultado;
      }

    }, error => { });
  }

  buscarDetalleEmpresa(tipo = 1): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas/${this.cliente.id}`, { headers: header }).subscribe((res: any) => {
      this.clienteDetalle = res.datos;
    }, error => { });

  }

}
