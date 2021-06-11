import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import buques from 'src/assets/buques.json';
declare var $: any;

@Component({
  selector: 'app-recinto-nueva-solicitud',
  templateUrl: './recinto-nueva-solicitud.component.html',
  styleUrls: ['./recinto-nueva-solicitud.component.css']
})
export class RecintoNuevaSolicitudComponent implements OnInit {
  manifiesto = '';
  page = 1;
  agenciaAduanal = '';
  rfcCliente = '';
  nombreCliente = '';
  manifiestoData: any = [];
  public buque: any;
  
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
  data = [
    {
      manifiesto: 123412,
      marca: 'Marca',
      embalaje: 'Embalaje',
      piezas: '10',
      peso: '2 toneladas',
      unidades: '1000'
    }
  ];
  man: any = {};
  tipoServicio = [
    {id : 'Contenedores', descripcion: 'Contenedores' },
    {id : 'Carga suelta', descripcion: 'Carga suelta' }
  ];
  tipoTramite = [
    {id : 'Importación', descripcion: 'Importación' },
    {id : 'Exportación', descripcion: 'Exportación' },
    {id : 'Transbordo', descripcion: 'Transbordo' }
  ];
  tipoSolicitud = [
    {id : 'Entrada', descripcion: 'Entrada' },
    {id : 'Salida', descripcion: 'Salida' },
    {id : 'Movimientos', descripcion: 'Movimientos' },
    {id : 'Liberación', descripcion: 'Liberación' },
  ];
  medioTransporte = [
    {id : 'Carretero', descripcion: 'Carretero' },
    {id : 'Ferroviario', descripcion: 'Ferroviario' },
    {id : 'Marítimo', descripcion: 'Marítimo' }
  ];

  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    public http: HttpClient) { }

  ngOnInit(): void {
    const user = this.auth.getSession().userData;
    this.agenciaAduanal = user.empresa;
    $('#fecha-servicio').datepicker();
    $('#fecha-arribo').datepicker();
    $('#fecha-inicio-operaciones').datepicker();
    $('#fecha-zarpe').datepicker();
    
      /*const header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${res.valor}`
      });*/
      /*this.http.get(environment.endpointCat + 'transportes/tipos',{headers: header}).subscribe((res: any) => {
        console.log(res.valor);

      },error =>{});*/
      //this.http.get(environment.endpointCat,{headers: header}).subscribe((res: any) => {},error =>{});

  }

  consulta(): void {
    this.spinner.show();
    this.http.post<any>(environment.endpoint + 'sicrefis', { manifiesto: this.manifiesto, buque: '' }).subscribe(res => {
      this.spinner.hide();
      this.manifiestoData = res.manifiestos;
      this.man = res.man;
    }, error => {
      this.spinner.hide();
    })
  }

  searchName(): void{
    this.spinner.show();
    this.http.get<any>(environment.endpoint + 'clientes?rfc=' + this.rfcCliente).subscribe(res =>{
      this.spinner.hide();
      console.log(res);
      this.nombreCliente = res.nombre;
    },error =>{
      this.spinner.hide();
    });
  }

}
