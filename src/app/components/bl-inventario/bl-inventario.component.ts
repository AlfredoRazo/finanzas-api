import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bl-inventario',
  templateUrl: './bl-inventario.component.html',
  styleUrls: ['./bl-inventario.component.css']
})
export class BlInventarioComponent implements OnInit {
  bl: any;
  visualBL: any;
  blData:any;
  mensajeErr = '';
  page = 1;
  hoy = new Date();
  isPrint = false;
  data: any[] = [];
  originalData: any[] = [];
  visualSolicitud: any;
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
  constructor(
    private auth: AuthService,
    private pagina: PaginateService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
  }

  consulta(): void {
    this.mensajeErr = '';
    this.spinner.show();
    this.http.get<any>(`https://pis-api-recinto.azurewebsites.net/api/consultarBl?BL=${this.bl}`).subscribe(res => {
      this.spinner.hide();
      if(res.length > 1){
        this.visualBL = res[0][0];
        this.getSolicitudesServicios(this.visualBL.bl);
      }else{
        this.visualBL = null;
        this.mensajeErr = 'No se encontró el BL';
      }
    });
  }
  getSolicitudesServicios(bl:string): void {
    this.spinner.show();
    const user = this.auth.getSession().userData;
    if (user.idRol == 2101) {
      this.puedeAutorizar = false;
    }

    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/solicitudes?idEmpresa=${user.empresaid}&BL=${bl}`).subscribe((res: any) => {
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
    this.imprimeFormato = null;
    this.visualSolicitud = item;
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
    }, error => {
      this.blliberacion = [];
      this.blliberacionDocs = [];
    });
  }

}
