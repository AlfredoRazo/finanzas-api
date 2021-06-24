import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
export interface FacturaForm {
  cantidad: string;
  cantidadunidad: string;
  volumen: string;
  volumenunidad: string;
  peso: string;
  pesounidad: string;
  concepto: string;
}
@Component({
  selector: 'app-facturacion-consulta-tipo',
  templateUrl: './facturacion-consulta-tipo.component.html',
  styleUrls: ['./facturacion-consulta-tipo.component.css']
})
export class FacturacionConsultaTipoComponent implements OnInit {
  catalogos = environment.endpoint + 'sapCatalogos?catalogo='
  tabledat: FacturaForm = {} as FacturaForm;
  clientes : any[] = [];
  conceptos : any[] = [];
  unidadesmedida : any[] = [];
  data: any[] = [];
  buque: any;
  buques: any[] = [];
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
    solicitados: any;
    facturaa: any;
    searchCliente:any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => 
        term.length < 2 ? []
        : this.clientes.filter( (v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    );

  constructor(private http: HttpClient,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getClientes();
    this.getConceptos();
    this.getUnidadesMedida();
    this.getBuques();
    
  }
  getClientes(): void{
    this.spinner.show();
    this.http.get(`${environment.endpoint}clientes`).subscribe( (res: any) => {
      this.clientes = res[0];
      this.spinner.hide();
    },err =>{this.spinner.hide()});
  }
  getConceptos(): void{
    this.spinner.show();
    this.http.get(`${environment.endpoint}conceptos`).subscribe( (res: any) => {
      
      this.conceptos = res;
      this.spinner.hide();
    },err =>{this.spinner.hide()});
  }
  getUnidadesMedida(): void{
    this.http.get( this.catalogos + 'unidadesmedida').subscribe((res: any) =>{
      this.unidadesmedida = res.valores;
    });
  }
  guardarData(): void{
    this.data.push(this.tabledat);
    this.tabledat = {} as FacturaForm;
  }
  removeData(index: any): void{
    this.data.splice(index,1);
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

}
