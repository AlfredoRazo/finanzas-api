import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.css']
})
export class RecintoComponent implements OnInit {
  manifiesto = '';
  manifiestoData: any;
  submenu = 1;
  page = 1;
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

  documentosVisual: any[] = []

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private pagina: PaginateService,
    private http: HttpClient) { }
  ngOnInit(): void {
    this.getSolicitudesServicios();

  }

  getSolicitudesServicios(): void {
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}solicitud/v1`).subscribe((res: any) => {
      if (!res.error) {

        this.total = res.datos.length;
        this.originalData =res.datos.map((item: any) => {
          item.selected = false;
          return item;
        });
        const fir = [...this.originalData];
        this.data = this.pagina.paginate(fir, this.collSize, this.page);
      } else {

      }
      this.spinner.hide();
    }, err => { this.spinner.hide(); });
  }

  consultarManifiesto(): void {
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}manifiesto/v1/num/${this.manifiesto}`).subscribe((res: any) => {
      this.manifiestoData = res.datos;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
  consultaBL(idBL: string): void {
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}bl/${idBL}`).subscribe((res: any) => {
      this.visualBL = res.datos;
      this.getDocumentos(res.datos.bl);
      this.getDetalleBL(res.datos.bl);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });

  }
  getTipoSolicitud(id: string): string {
    return [
      { id: '1', descripcion: 'Entrada' },
      { id: '2', descripcion: 'Salida' },
      { id: '3', descripcion: 'Movimientos' },
      { id: '4', descripcion: 'Liberación' },
    ].filter(item => { return id == item.id })[0]?.descripcion;
  }

  getTipoTramite(id: string): string {
    return [
      { id: '1', descripcion: 'Importación' },
      { id: '2', descripcion: 'Exportación' },
      { id: '3', descripcion: 'Transbordo' }
    ].filter(item => { return id == item.id })[0]?.descripcion;
  }

  getTipoTransporte(id: string): string {
    return [
      { id: '1', descripcion: 'Carretero' },
      { id: '2', descripcion: 'Ferroviario' },
      { id: '3', descripcion: 'Marítimo' }
    ].filter(item => { return id == item.id })[0]?.descripcion;
  }

  visualizar(item: any): void {
    this.visualSolicitud = item;
    this.consultaBL(item.idBl);
  }

  autorizar(): void {
    this.hasError = false;
    this.hasSuccess = false;
    this.msj = '';
    const payload = this.data.filter((item: any) => {
      return item.selected
    }).map((item: any) => {
      return {
        idSolicitud: item.id,
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
  getDetalleBL(bl: string): void{
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/BLObtenerSolicitudes?bl=${bl}`).subscribe((res: any) => {
      if (res) {
        console.log(res);
        this.visualDetalleBL = res;
      }
    });
  }

}
