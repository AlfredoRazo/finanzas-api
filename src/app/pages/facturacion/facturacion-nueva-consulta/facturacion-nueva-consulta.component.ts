import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import buques from 'src/assets/buques.json';

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

  materiales : any[] = [];
  listaprecios : any[] = [];
  oficinaventa : any[] = [];
  sectores : any[] = [];
  unidadesmedida : any[] = [];
  buque: any;
  search:any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => 
        term.length < 2 ? []
        : buques.filter( (v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    );
    formatter = (x: {nombre: string}) => x.nombre;

  constructor(
    private spinner: NgxSpinnerService,
    public http: HttpClient) { }

  ngOnInit(): void {
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
  }

  submit(form : any): void{
    this.spinner.show();
    this.http.post<any>(environment.endpoint + 'consultasap', form.value).subscribe(res => {
      this.spinner.hide();
      console.log(res);
      if(res[0].error){
        this.hasSuccess = false;
        this.successMsj = ''
        this.hasError = true;
        this.errorMsj = res[0].errorStr;
      }else{
        form.reset();
        form.resetForm();
        this.hasError = false;
        this.errorMsj = '';
        this.hasSuccess = true;
        this.successMsj = 'Se guardó correctamente, número de consulta : ' + res[0].noConsulta;
      }
    }, error => {
      this.spinner.hide();
    })

  }

}
