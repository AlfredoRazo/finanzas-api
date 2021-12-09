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
  formatobls:any [] = [];
  blsalidaDocs: any[] = [];
  blsalida: any[] = [];
  bldocs: any[] = [];
  documentosVisual: any[] = [];
  imprimeFormato: any;
  puedeAutorizar = true;
  imgheader:any;
  criterio = 'BL';
  buscador = '';
  areaInventario = '';
  areas : any[] = [];
  moves: any[] = [];
  detalleMov: any;
  fechaInventario: any;
  zonas: any[] = [];
  zonaInventario: any;
  hora: any;
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

  getCatInventario(): void{
    this.http.get('https://pis-api-recinto.azurewebsites.net/api/catalogos?catalogo=areas').subscribe((res:any)=>{
    this.areas = res[0];
    },error=>{});
    
  }
  getZonas(): void{
    this.http.get('https://pis-api-recinto.azurewebsites.net/api/catalogos?catalogo=' + this.areaInventario).subscribe((res:any)=>{
    this.zonas = res[0];
    },error=>{});
    
  }

  getSolicitudesServicios(): void {
    this.spinner.show();
    const user = this.auth.getSession().userData;
    if (user.idRol == 2101) {
      this.puedeAutorizar = false;
    }
    let query = '';
    if(this.buscador){
      query = '&' + this.criterio + '=' + this.buscador;
    }
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/solicitudes?idEmpresa=${user.empresaid}${query}`).subscribe((res: any) => {
      if (res.length > 1) {
        this.total = res[0].length;
        this.originalData = res[0].map((item: any) => {
          item.selected = false;
          item.selectedhechos = false;
          return item;
        });
        const fir = [...this.originalData];
        this.data = this.pagina.paginate(fir, this.collSize, this.page);
      }
      this.spinner.hide();
    }, err => { this.spinner.hide(); });
  }


  consultaBL(idBL: string): void {
    this.spinner.show();
    this.http.get(`${environment.endpointRec}bl/${idBL}`).subscribe((res: any) => {
      this.visualBL = res.datos;
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
      appkey : "c53ea43376d653a43e10711de2da2d9b6f156ead",
      registros: reg
    }
  
    this.http.post(`https://pis-api-recinto.azurewebsites.net/api/solicitudActualizar`, payload).subscribe((res: any) => {
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
        fecha: this.fechaInventario + ' ' + this.hora + ':00'
      };
    });
    const payload = {
      appkey : "c53ea43376d653a43e10711de2da2d9b6f156ead",
      registros: reg
    }
 
    this.http.post(`https://pis-api-recinto.azurewebsites.net/api/solicitudInventario`, payload).subscribe((res: any) => {
      if (!res.error) {
        this.getSolicitudesServicios();
        this.hasSuccess = true;
        Swal.fire({
          icon: 'success',
          title:  res.mensaje ?  res.mensaje : 'Se añadió correctamente al inventario',
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
    this.http.get(`${environment.endpointApi}recintoDocumentos?bl=${bl}`).subscribe((res: any) => {
      if (res) {
        this.documentosVisual = res;
      } else {
        this.documentosVisual = [];
      }
    });
  }
  paginado(evt: any = null): void {

    this.data = this.pagina.paginate(this.originalData, 10, this.page);
    this.descripcionPaginado();
  }
  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.total + this.collSize - 1) / this.collSize);
    var start = (this.page * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.total);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }
  getDetalleBL(bl: string): void {
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/BLObtenerSolicitudes?bl=${bl}`).subscribe((res: any) => {
      if (res) {

        this.visualDetalleBL = res;
      }
    });
  }
  getDetalleFormato(bl: string, idLiberacion: string): void {
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/rptAutLiberacion?Referencia=${bl}&idLiberacion=${this.visualSolicitud.solicitudId}`).subscribe((res: any) => {
      this.imprimeFormato = res[0][0];
      this.formatobls = res[0]
    });
  }

  getMovimientosBL(bl: string): void {

    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/Movimientos?tipoMovimiento=Separación&BL=${bl}`).subscribe(res => {
      if (res.length > 2) {
        this.blmovimiento = res[1];
      } else {
        this.blmovimiento = [];
      }
    }, error => {
    });
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudSalida?referencia=${bl}`).subscribe(res => {
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
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/Movimientos?tipoMovimiento=Previo&BL=${bl}`).subscribe(res => {
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
   
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudLiberacion?referencia=${bl}&idLiberacion=${this.visualSolicitud.idSolicitud}`).subscribe(res => {
     
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
