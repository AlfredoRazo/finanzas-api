import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  total = 0;
  payloadInventario: any = {};
  originalData: any[] = [];
  data: any[] = [];
  page = 1;
  collSize: any = 10;
  descPaginado = '';
  bl: any;
  buqueDetalle: any = {};
  fechaini: any;
  fechafin: any;
  opcionesInventario = [
    { id: 1, display: 'Entrada Importación' },
    { id: 2, display: 'Salida Importación' },
    { id: 3, display: 'Entrada Exportación' },
    { id: 4, display: 'Salida Exportación' },

  ];
  inventarioId: any;

  constructor(private pagina: PaginateService,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {

    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaini = date } });
    $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechafin = date } });
  }

  getData(): void {
    this.total = 0;
    this.data = [];
    this.originalData = [];
    let apiid = this.auth.getSession().userData.idAPI;
    this.spinner.show();
    switch (this.inventarioId) {
      case '1':
        this.http.get(`${environment.endpointRecinto}/api/inventarioEntradaImpo?idAPI=${apiid}`).subscribe(
          (res: any) => {
            this.total = res[0].length;
            this.originalData = [...res[0]];
            this.data = this.pagina.paginate([...this.originalData], this.collSize, this.page);

            this.spinner.hide();
          }, err => { this.spinner.hide(); });
        break;
      case '2':
        this.http.get(`${environment.endpointRecinto}/api/inventarioSalidaImpo?idAPI=${apiid}`).subscribe((res: any) => {
          this.total = res[0].length;
          this.originalData = [...res[0]];
          this.data = this.pagina.paginate([...this.originalData], this.collSize, this.page);
          this.spinner.hide();
        }, err => { this.spinner.hide(); });
        break;
      case '3':
        this.http.get(`${environment.endpointRecinto}/api/inventarioEntradaExpo?idAPI=${apiid}`).subscribe((res: any) => {
          this.total = res[0].length;
          this.originalData = [...res[0]];
          this.data = this.pagina.paginate([...this.originalData], this.collSize, this.page);
          this.spinner.hide();
        }, err => { this.spinner.hide(); });
        break;
      case '4':
        this.http.get(`${environment.endpointRecinto}/api/inventarioSalidaExpo?idAPI=${apiid}`).subscribe((res: any) => {
          this.total = res[0].length;
          this.originalData = [...res[0]];
          this.data = this.pagina.paginate([...this.originalData], this.collSize, this.page);
          this.spinner.hide();
        }, err => { this.spinner.hide(); });
        break;
      default:
        this.spinner.hide();
        break;
    }
    
    /*let query = '';
    if (this.bl) {
      query += `&BL=${this.bl}`;
    }
    if (this.fechaini && this.fechafin) {
      query += `&fechaInicial=${this.fechaini}&fechaFin=${this.fechafin}`;
    }
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}/api/inventario?t=${query}`).subscribe((res: any) => {

     
      console.log(this.data);

      this.spinner.hide();
    }, err => { this.spinner.hide(); });*/
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
  getDetalleBuque(buque: string , viaje: string):void{
    let apiid = this.auth.getSession().userData.idAPI;
    this.http.get(`${environment.endpointEstadoHechos}Buques?buque=${buque}&viaje=${viaje}&idAPI=${apiid}`).subscribe(
      (res: any) => {
        console.log(res);
      },(err: any) =>{});
  }

}
