import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
export interface CargaManifiesto {
  embarcador: string;
  consignario: string;
  notificar: string;
  bl: string;
  marcasnumeros: string;
  cantidad: string;
  unidadmedida: string;
  descripcion: string;
  pesobrutokg: string;
  volumen: string;
}

@Component({
  selector: 'app-carga-manifiesto',
  templateUrl: './carga-manifiesto.component.html',
  styleUrls: ['./carga-manifiesto.component.css']
})
export class CargaManifiestoComponent implements OnInit {
  public buque: any;
  buques: any[] = [];
  fecha: any;
  conceptos: any[] = [];
  unidadesmedida: any[] = [];
  data: any[] = [];
  concepto = '';
  tabledat: CargaManifiesto = {} as CargaManifiesto;
  catalogos = environment.endpoint + 'sapCatalogos?catalogo=';
  indexEdit: any;
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
    $('#fecha').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fecha = date } });
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
}
