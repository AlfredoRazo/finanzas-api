import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { PaginateService } from '@serv/paginate.service';
import { PdfService } from '@serv/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
import Swal from 'sweetalert2'

@Component({
  selector: 'app-solicitud-servicio',
  templateUrl: './solicitud-servicio.component.html',
  styleUrls: ['./solicitud-servicio.component.css']
})
export class SolicitudServicioComponent implements OnInit {


  page = 1;
  hoy = new Date();
  isPrint = false;
  data: any[] = [];
  originalData: any[] = [];
  visualSolicitud: any;
  visualBL: any;
  hasError = false;
  hasSuccess = false;
  msj = '';
  descPaginado = '';
  collSize: any = 10;
  total = 0;
  visualDetalleBL: any;
  blmovimiento: any[] = [];
  blliberacion: any[] = [];
  blliberacionDocs: any[] = [];
  formatobls: any[] = [];
  blsalidaDocs: any[] = [];
  blsalida: any[] = [];
  bldocs: any[] = [];
  documentosVisual: any[] = [];
  imprimeFormato: any;
  puedeAutorizar = true;
  imgheader: any;
  criterio = 'bl';
  buscador = '';
  criteriosB = [
    {desc: 'bl', descripcion: 'BL'},
    {desc: 'idSolicitud', descripcion: 'ID Solicitud'},
    {desc: 'tipoServicio', descripcion: 'Tipo Servicio'},
    {desc: 'tipoTramite', descripcion: 'Tipo Trámite'},
    {desc: 'tipoSolicitud', descripcion: 'Tipo Solicitud'},
    {desc: 'tipoTransporte', descripcion: 'Tipo Transporte'},
    {desc: 'patente', descripcion: 'Patente'},
    {desc: 'fechaServicio', descripcion: 'Fecha Servicio'},
    {desc: 'nombre', descripcion: 'Cliente'}
  ];
  areaInventario = '';
  areas: any[] = [];
  moves: any[] = [];
  detalleMov: any;
  fechaInventario: any;
  zonas: any[] = [];
  zonaInventario: any;
  hora: any;
  editData: any = {};
  editBL: any = {};
  editLiberacion: any = {};
  filtro = false;
  filterData:any = [];
  patternshours = {
    '0': { pattern: new RegExp(/[0-2]/) },
    '1': { pattern: new RegExp(/[0-9]/) },
    '2': { pattern: new RegExp(/[0-5]/) }
  };

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private pdf: PdfService,
    private pagina: PaginateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getSolicitudesServicios();
    this.getCatInventario();
    this.getZonas();
    $('#fecha-inventario').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaInventario = date } });
  }

  editMode(item: any): void {
    this.spinner.show();
    this.editData = { ...item };
    this.editData.fechaServicio = this.editData.fechaServicio.substring(0,10);
    this.editData.fechaArribo = this.editData.fechaArribo.substring(0,10);
    this.editData.fechaZarpe = this.editData.fechaZarpe.substring(0,10);
    this.editData.fechaIniOperaciones = this.editData.fechaIniOperaciones.substring(0,10);
    $('#fecha-servicio').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => {  this.editData.fechaServicio = date } });
    $('#fecha-arribo').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.editData.fechaArribo = date } });
    $('#fecha-zarpe').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.editData.fechaZarpe = date } });
    $('#fecha-iniop').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.editData.fechaIniOperaciones = date } });
  
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/bl/${this.editData.idBl}?idAPI=${apiid}`).subscribe((res: any) => {
      this.editBL = res[0][0];
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  
    this.http.get<any>(`${environment.endpointRecinto}/api/solicitudLiberacion?idAPI=${apiid}&referencia=${this.editData.bl}&idLiberacion=${this.editData.idSolicitud}`).subscribe(res => {

      if (res.length == 3) {
        this.editLiberacion = res[0][0];
      }
      if (res.length == 2) {
        if (res[0][0].archivo) {
      
        } else {
          this.editLiberacion= res[0][0];
        }
      }

    }, error => {});
  }

  saveEditSolicitud(): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    const payload = {
      appKey: "prueba202201",
      solicitudDatos: [{
        idSolicitud: this.editData.idSolicitud,
        buque: this.editData.buque,
        patente: this.editData.patente,
        viaje:this.editData.viaje,
        fechaServicio: this.editData.fechaServicio + ' 00:00:00',
        fechaArribo: this.editData.fechaArribo + ' 00:00:00',
        fechaIniOperaciones: this.editData.fechaIniOperaciones+ ' 00:00:00',
        fechaZarpe: this.editData.fechaZarpe+ ' 00:00:00'
      }]
    };
    this.http.post(`${environment.endpointRecinto}/api/solicitudEditar?idAPI=${apiid}`, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.error) {
        Swal.fire({
          icon: 'success',
          title: res.mensaje ? res.mensaje : 'Se actualizo correctamente la solicitud',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: res.mensaje ? res.mensaje : 'Ocurrió un error al actualizar',
          showConfirmButton: false,
          timer: 2500
        })
      }
    }, err => {
      this.spinner.hide();
    });
  }

  saveEditBL(): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    const payload = {
      appKey: 'prueba202201',
      solicitudDatosBL: [{
        idBL: this.editBL.idBL,
        embarcador: this.editBL.embarcador,
        consignatario: this.editBL.consignatario,
        notificarA: this.editBL.notificarA,
        marcasNumeros: this.editBL.marcasNumeros,
        cantidad: this.editBL.cantidad,
        unidad: this.editBL.unidad,
        descripcion: this.editBL.descripcion,
        pesoBruto: this.editBL.pesoBruto,
        volumen: this.editBL.volumen
      }]
    };
    this.http.post(`${environment.endpointRecinto}/api/BLEditar?idAPI=${apiid}`, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.error) {
        this.hasSuccess = true;
        Swal.fire({
          icon: 'success',
          title: res.mensaje ? res.mensaje : 'Se actualizo correctamente el BL',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: res.mensaje ? res.mensaje : 'Ocurrió un error al actualizar',
          showConfirmButton: false,
          timer: 2500
        })
      }
    }, err => {
      this.spinner.hide();
    });
  }

  saveEditLiberacion(): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    const payload = {
      appKey: 'prueba202201',
      datostblSol: [{
        idSolicitudMovimento: this.editLiberacion.solicitudId,
        solicitudFechaAlta: this.editLiberacion.solicitudFechaAlta.substring(0,10) + ' 00:00:00',
        solicitudUsuario:'',
        solicitudBL:this.editLiberacion.solicitudBL,
        solicitudClavePedimento:this.editLiberacion.solicitudClavePedimento,
        solicitudTipoPedimento: this.editLiberacion.solicitudTipoPedimento,
        solicitudNumPedimento:this.editLiberacion.solicitudNumPedimento,
        solicitudtipoCambio:this.editLiberacion.solicitudClavePedimento,
        solicitudValorAduana:this.editLiberacion.solicitudValorAduana,
        solicitudPiezas:this.editLiberacion.solicitudPiezas,
        solicitudPeso:this.editLiberacion.solicitudPeso,
        solicitudNumPartes:this.editLiberacion.solicitudNumPartes,
        solicitudNumCopias:this.editLiberacion.solicitudNumCopias,
        solicitudCoves:this.editLiberacion.solicitudCoves
	}]
    };
    this.http.post(`${environment.endpointRecinto}/api/tblSolEditar?idAPI=${apiid}`, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.error) {
        this.hasSuccess = true;
        Swal.fire({
          icon: 'success',
          title: res.mensaje ? res.mensaje : 'Se actualizo correctamente la liberación',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: res.mensaje ? res.mensaje : 'Ocurrió un error al actualizar',
          showConfirmButton: false,
          timer: 2500
        })
      }
    }, err => {
      this.spinner.hide();
    });

  }

  getCatInventario(): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/catalogos?idAPI=${apiid}&catalogo=areas`).subscribe((res: any) => {
      this.areas = res[0];
    }, error => { });

  }
  getZonas(): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/catalogos?idAPI=${apiid}&catalogo=` + this.areaInventario).subscribe((res: any) => {
      this.zonas = res[0];
    }, error => { });

  }

  getSolicitudesServicios(): void {
    this.spinner.show();
    const user = this.auth.getSession().userData;
    if (user.idRol == 2101) {
      this.puedeAutorizar = false;
    }
    let query = '';
    if (this.buscador) {
      query = '&' + this.criterio + '=' + this.buscador;
    }
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/solicitudes?idAPI=${apiid}&idEmpresa=${user.empresaid}${query}`).subscribe((res: any) => {
      if (res.length > 1) {
        this.total = res[0].length;
        this.originalData = res[0].map((item: any) => {
          item.selected = false;
          item.selectedhechos = false;
          item.selectedcancel = false;
          return item;
        });
        const fir = [...this.originalData];
        this.data = this.pagina.paginate(fir, this.collSize, this.page);
        this.filterData = [...this.originalData];
      }
      this.spinner.hide();
    }, err => { this.spinner.hide(); });
  }


  consultaBL(idBL: string): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/bl/${idBL}?idAPI=${apiid}`).subscribe((res: any) => {
      this.visualBL = res[0][0];
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });

  }


  visualizar(item: any): void {
    this.blliberacion = [];
    this.blliberacionDocs = [];
    this.blmovimiento = [];
    this.blsalida = [];
    this.blsalidaDocs = [];
    this.bldocs = [];
    this.moves = [];
    this.imprimeFormato = null;
    this.visualSolicitud = item;
    this.detalleMov = null;
    this.consultaBL(item.idBl);

    switch (item.tipoSolicitud) {
      case 'Entrada':
        break;
      case 'Liberación':
        this.getLiberaciones(item.bl);
        break
      default:
        //this.getDocumentos(item.bl);
        this.getDetalleBL(item.bl);
        this.getMovimientosBL(item.bl);

        break;

    }

  }
  cancelar(): void {
    this.hasError = false;
    this.hasSuccess = false;
    this.msj = '';
    const reg = this.data.filter((item: any) => {
      return item.selectedcancel
    }).map((item: any) => {
      return {
        idSolicitud: item.idSolicitud,
        estatus:'Cancelado'
      };
    });
    const payload = {
      appKey: "prueba202201",
      datosCancelar: reg
    }
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.post(`${environment.endpointRecinto}/api/peticionCancelar?idAPI=${apiid}`, payload).subscribe((res: any) => {
      if (!res.error) {
        this.getSolicitudesServicios();
        this.hasSuccess = true;
        this.msj = res.mensaje;
      } else {
        this.hasError
        this.msj = res.mensaje;
      }
    }, err => { });
  }


  autorizar(): void {
    this.hasError = false;
    this.hasSuccess = false;
    this.msj = '';
    const reg = this.data.filter((item: any) => {
      return item.selected
    }).map((item: any) => {
      return {
        idSolicitud: item.idSolicitud,
        value: 100
      };
    });
    const payload = {
      appkey: "c53ea43376d653a43e10711de2da2d9b6f156ead",
      registros: reg
    }
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.post(`${environment.endpointRecinto}/api/solicitudActualizar?idAPI=${apiid}`, payload).subscribe((res: any) => {
      if (!res.error) {
        this.getSolicitudesServicios();
        this.hasSuccess = true;
        this.msj = res.mensaje;
      } else {
        this.hasError
        this.msj = res.mensaje;
      }
    }, err => { });
  }

  inventario(): void {
    this.hasError = false;
    this.hasSuccess = false;
    this.msj = '';
    const reg = this.data.filter((item: any) => {
      return item.selectedhechos
    }).map((item: any) => {
      return {
        idSolicitud: item.idSolicitud,
        value: 100,
        usuarioModifica: this.auth.getSession().userData.username,
        area: this.zonaInventario,
        //area:this.areaInventario,
        //zona: this.zonaInventario,
        fecha: this.fechaInventario + ' ' + '00:00:00'
      };
    });
    const payload = {
      appkey: "c53ea43376d653a43e10711de2da2d9b6f156ead",
      registros: reg
    }
    
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.post(`${environment.endpointRecinto}/api/solicitudInventario?idAPI=${apiid}`, payload).subscribe((res: any) => {
      if (!res.error) {
        this.getSolicitudesServicios();
        this.hasSuccess = true;
        Swal.fire({
          icon: 'success',
          title: res.mensaje ? res.mensaje : 'Se añadió correctamente al inventario',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        this.hasError
        this.msj = res.mensaje;
      }
    }, err => { });
  }

  getDocumentos(bl: string) {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointApi}recintoDocumentos?idAPI=${apiid}&bl=${bl}`).subscribe((res: any) => {
      if (res) {
        this.documentosVisual = res;
      } else {
        this.documentosVisual = [];
      }
    });
  }
  filtrado(): void{

    this.page = 1;
    if(this.criterio && this.buscador){
      this.filtro = true;
      this.filterData = this.originalData.filter((item: any) =>{
         return item[this.criterio].toLowerCase().includes(this.buscador.toLowerCase());
      })
      this.total = this.filterData.length;
      this.paginado();
    }else{
      this.filtro = false;
      this.total = this.originalData.length;
      this.paginado();
    }
    
  }

  paginado(evt: any = null): void {
    if(this.filtro){
      this.data = this.pagina.paginate(this.filterData, 10, this.page);
    }else{
      this.data = this.pagina.paginate(this.originalData, 10, this.page);
    }
    this.descripcionPaginado();
  }

  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.total + this.collSize - 1) / this.collSize);
    var start = (this.page * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.total);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }
  getDetalleBL(bl: string): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/BLObtenerSolicitudes?idAPI=${apiid}&bl=${bl}`).subscribe((res: any) => {
      if (res) {
        this.visualDetalleBL = res;
      }
    });
  }
  getDetalleFormato(bl: string, idLiberacion: string): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointRecinto}/api/rptAutLiberacion?idAPI=${apiid}&Referencia=${bl}&idLiberacion=${this.visualSolicitud.solicitudId}`).subscribe((res: any) => {
      this.imprimeFormato = res[0][0];
      this.formatobls = res[0]
    });
  }

  getMovimientosBL(bl: string): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get<any>(`${environment.endpointRecinto}/api/Movimientos?idAPI=${apiid}&tipoMovimiento=Separación&BL=${bl}`).subscribe(res => {
      if (res.length > 2) {
        this.blmovimiento = res[1];
      } else {
        this.blmovimiento = [];
      }
    }, error => {
    });
    this.http.get<any>(`${environment.endpointRecinto}/api/solicitudSalida?idAPI=${apiid}&referencia=${bl}`).subscribe(res => {
      if (res.length == 3) {
        this.blsalida = res[0];
        this.blsalidaDocs = res[1];
      }
      if (res.length == 2) {
        this.blsalida = res[0];
      }
    }, error => {
      this.blsalida = [];
      this.blsalidaDocs = [];
    });
    this.http.get<any>(`${environment.endpointRecinto}/api/Movimientos?idAPI=${apiid}&tipoMovimiento=Previo&BL=${bl}`).subscribe(res => {
      if (res.length > 2) {
        this.detalleMov = res[0];
        this.moves = res[1];
        this.bldocs = res[2];
      } else {
        this.moves = [];
        this.bldocs = [];
      }
    }, error => {
    });
  }

  getTipoPedimento(id: string): string {
    switch (id) {
      case '1':
        return 'Normal';
      case '2':
        return 'Parte 2';
      case '3':
        return 'Copia Simple';
      case '4':
        return 'Pedimento Consolidado';
      default:
        return '';
        break;
    }
  }

  async imprimir() {
    this.spinner.show();
    this.isPrint = true;
    await this.sleep(800);
    const DATA = document.getElementById('contenido-imprimir');
    this.pdf.downloadPdf(DATA, this.spinner);
    this.isPrint = false;
  }
  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async imprimirSolicitud() {
    this.spinner.show();
    this.isPrint = true;
    await this.sleep(800);
    const DATA = document.getElementById('imprimir-solicitud');
    this.pdf.downloadPdf(DATA, this.spinner);
    this.isPrint = false;
  }

  getLiberaciones(bl: string): void {
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get<any>(`${environment.endpointRecinto}/api/solicitudLiberacion?idAPI=${apiid}&referencia=${bl}&idLiberacion=${this.visualSolicitud.idSolicitud}`).subscribe(res => {

      if (res.length == 3) {
        this.blliberacion = res[0];
        this.blliberacionDocs = res[1];
      }
      if (res.length == 2) {
        if (res[0][0].archivo) {
          this.blliberacionDocs = res[0];
        } else {
          this.blliberacion = res[0];
        }
      }

      if (this.blliberacion[0]?.solicitudBL) {
        this.getDetalleFormato(this.blliberacion[0]?.solicitudBL, this.blliberacion[0]?.solicitudId);
      }
    }, error => {
      this.blliberacion = [];
      this.blliberacionDocs = [];
    });
  }
}
