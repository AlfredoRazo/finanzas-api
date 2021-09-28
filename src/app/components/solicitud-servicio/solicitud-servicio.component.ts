import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { PaginateService } from '@serv/paginate.service';
import { PdfService } from '@serv/pdf.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;

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
  blsalidaDocs: any[] = [];
  blsalida: any[] = [];
  bldocs: any[] = [];
  documentosVisual: any[] = [];
  imprimeFormato: any;
  puedeAutorizar = true;

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private pdf: PdfService,
    private pagina: PaginateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getSolicitudesServicios();
  }

  getSolicitudesServicios(): void {
    this.spinner.show();
    const user = this.auth.getSession().userData;
    if(user.idRol == 2101){
      this.puedeAutorizar = false;
    }

    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/solicitudes?idEmpresa=${user.empresaid}`).subscribe((res: any) => {
      if (res.length > 1) {
        this.total = res[0].length;
        this.originalData = res[0].map((item: any) => {
          item.selected = false;
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
    this.http.get(`${environment.endpointRecinto}bl/${idBL}`).subscribe((res: any) => {
      this.visualBL = res.datos;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });

  }


  visualizar(item: any): void {
    this.visualSolicitud = item;
    this.consultaBL(item.idBl);

    switch (item.tipoSolicitud) {
      case 'Entrada':
        break;
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
    const payload = this.data.filter((item: any) => {
      return item.selected
    }).map((item: any) => {
      return {
        idSolicitud: item.idSolicitud,
        estatus: 100
      };
    });
    this.http.put(`${environment.endpointRecinto}Solicitud/v1/estatus/masivo`, payload).subscribe((res: any) => {
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

  getDocumentos(bl: string) {
    this.http.get(`${environment.endpointApi}recintoDocumentos?bl=${bl}`).subscribe((res: any) => {
      if (res) {
        this.documentosVisual = res;
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
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/rptAutLiberacion?Referencia=${bl}&idLiberacion=${idLiberacion}`).subscribe((res: any) => {
      if (res[0][0]) {
        this.imprimeFormato = res[0][0];
      }
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

    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudLiberacion?referencia=${bl}&idMovimiento=${this.visualSolicitud.movimientoId}`).subscribe(res => {
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
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/solicitudSalida?referencia=${bl}`).subscribe(res => {
      if (res.length == 3) {
        this.blsalida = res[0];
        this.blsalidaDocs = res[1];
      }
    }, error => {
      this.blsalida = [];
      this.blsalidaDocs = [];
    });
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/Movimientos?tipoMovimiento=Previo&BL=${bl}`).subscribe(res => {
      if (res.length > 2) {
        this.bldocs = res[2];
      } else {
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
    this.isPrint = true;
    await this.sleep(800);
    const DATA = document.getElementById('contenido-imprimir');
    this.pdf.downloadPdf(DATA);
    this.isPrint = false;
  }
  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
