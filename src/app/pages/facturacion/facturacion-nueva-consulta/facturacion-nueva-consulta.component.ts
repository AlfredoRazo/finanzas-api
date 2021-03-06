import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'app-facturacion-nueva-consulta',
  templateUrl: './facturacion-nueva-consulta.component.html',
  styleUrls: ['./facturacion-nueva-consulta.component.css']
})
export class FacturacionNuevaConsultaComponent implements OnInit {
  errorMsj = '';
  hasError = false;
  hasSuccess = false;
  successMsj = '';
  catalogos = environment.endpoint + 'sapCatalogos?catalogo='
  canaldistribucion : any[] = [];
  grupovendedores : any[] = [];
  buques: any[] = [];
  materiales : any[] = [];
  listaprecios : any[] = [];
  oficinaventa : any[] = [];
  sectores : any[] = [];
  unidadesmedida : any[] = [];
  fechaEntrada: string = '';
  fechaSalida: string = '';
  buque: any;
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

  constructor(
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    public http: HttpClient) { }

  ngOnInit(): void {
    this.getBuques();
    this.http.get( this.catalogos + 'canaldistribucion').subscribe((res: any) =>{
      this.canaldistribucion = res.valores;
    });
    this.http.get( this.catalogos + 'grupovendedores').subscribe((res: any) =>{
      this.grupovendedores = res.valores;
    });
    this.http.get( this.catalogos + 'materiales').subscribe((res: any) =>{
      this.materiales = res.valores;
    });
    this.http.get( this.catalogos + 'listaprecios').subscribe((res: any) =>{
      this.listaprecios = res.valores;
    });
    this.http.get( this.catalogos + 'oficinaventa').subscribe((res: any) =>{
      this.oficinaventa = res.valores;
    });
    this.http.get( this.catalogos + 'sectores').subscribe((res: any) =>{
      this.sectores = res.valores;
    });
    this.http.get( this.catalogos + 'unidadesmedida').subscribe((res: any) =>{
      this.unidadesmedida = res.valores;
    });
    $('#fecha-entrada').datepicker({ dateFormat: 'yy-mm-dd', onSelect : (date: any)=>{this.fechaEntrada = date}  });
    $('#fecha-salida').datepicker({ dateFormat: 'yy-mm-dd', onSelect : (date: any)=>{this.fechaSalida = date} });
  }

  submit(form : any): void{
    let aux: any;
    if(form.value.nombreBuque !== undefined){
      if( form.value.nombreBuque.nombre){
      aux = form.value.nombreBuque;
      form.value.nombreBuque = form.value.nombreBuque.nombre;
      }else{
        aux = form.value.nombreBuque;
      }
    }
    form.value.zzfechaentrada = this.fechaEntrada;
    form.value.zzfechasalida = this.fechaSalida;
    this.spinner.show();
    this.http.post<any>(environment.endpoint + 'consultasap', form.value).subscribe(res => {
      this.spinner.hide();
      if(res[1].error){
        this.hasSuccess = false;
        this.successMsj = ''
        this.hasError = true;
        this.errorMsj = res[1].errorStr;
        form.value.nombreBuque = aux;
      }else{
        form.reset();
        form.resetForm();
        this.hasError = false;
        this.errorMsj = '';
        this.hasSuccess = true;
        this.successMsj = 'Se guard?? correctamente, n??mero de consulta : ' + res[0].noConsulta;
      }
    }, error => {
      form.value.nombreBuque = aux;
      this.spinner.hide();
    })

  }
  getBuques(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`
    });
    this.http.get(environment.endpointCat + 'buques',{headers: header}).subscribe((res: any) => {
      this.buques = res.valor;
    },error =>{});
  }

}
