import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

export interface CargaManifiesto {
  bl: string;
  embarcador: string;
  consignario: string;
  notificarA: string;
  marcasNumeros: string;
  cantidad: string;
  unidad: string;
  descripcion: string;
  pesoBruto: string;
  volumen: string;
  activo: boolean;
  modificado: boolean;
}

@Component({
  selector: 'app-carga-manifiesto',
  templateUrl: './carga-manifiesto.component.html',
  styleUrls: ['./carga-manifiesto.component.css']
})
export class CargaManifiestoComponent implements OnInit {
  public buque: any;
  buques: any[] = [];
  msj = '';
  hasError = false;
  hasSuccess = false;
  conceptos: any[] = [];
  unidadesmedida: any[] = [];
  data: any[] = [];
  concepto = '';
  manifiesto = '';
  fechaarribo = '';
  tabledat: CargaManifiesto = {} as CargaManifiesto;
  catalogos = environment.endpoint + 'sapCatalogos?catalogo=';
  indexEdit: any;
  viaje: any;
  search:any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => 
        term.length < 2 ? []
        : this.buques.filter( (v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    );
    formatter = (x: {nombre: string}) => x.nombre;

  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getBuques();
    this.getUnidadesMedida();
    $('#fecha').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaarribo = date } });
  }

  getBuques(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().userData.catToken}`
    });
    this.http.get(environment.endpointCat + 'buques',{headers: header}).subscribe((res: any) => {
      this.buques = res.valor;
    },error =>{});
  }
  getUnidadesMedida(): void {
    this.http.get(this.catalogos + 'unidadesmedida').subscribe((res: any) => {
      this.unidadesmedida = res.valores;
      this.unidadesmedida = this.unidadesmedida.filter(item =>{
        return (item.clave == '10' || item.clave == 'ST' || item.clave == 'KG')
      });
    });
  }
  guardarData(): void {
    this.data.push(this.tabledat);
    this.tabledat = {} as CargaManifiesto;
  }
  guardarEditData(): void {
    const concepto = this.conceptos.find(item => { return item.clave == this.concepto });
    this.data[this.indexEdit] = this.tabledat;
    this.tabledat = {} as CargaManifiesto;
  }
  removeData(index: any): void {
    this.data.splice(index, 1);
  }
  editData(index: any, item: any): void {
    this.tabledat = item;
    this.indexEdit = index;
  }

  cargarManifiesto(): void{
    const payload = {

      nuManifiesto: this.manifiesto,
      buque: this.buque?.nombre ? this.buque?.nombre : this.buque,
      viaje: this.viaje,
      acuse: '',
      barcoNacionalidad: '',
      barcoCapitan: '',
      puertoEmbarque: '',
      puertoEmision: '',
      puertoDescarga: '',
      fechaEntradaSalida: this.fechaarribo + 'T00:00:00.923Z',
      tipo: 0,
      bls: this.data,
      modificado: true
    };
    this.spinner.show();
      this.msj = '';
      this.hasError = false;
      this.hasSuccess = false;
    this.http.post(`${environment.endpointRecinto}manifiesto/v1`,payload).subscribe((response: any) => {
      if(!response.error){
        this.msj = response.mensaje;
        this.hasSuccess = true;
      }else{
        this.msj = response.mensaje;
        this.hasError = true;
      }
      this.spinner.hide();
    },err =>{
      this.spinner.hide();
      this.msj = 'No se pudo guardar su manifiesto';
      this.hasError = true;
    });
  }
}
