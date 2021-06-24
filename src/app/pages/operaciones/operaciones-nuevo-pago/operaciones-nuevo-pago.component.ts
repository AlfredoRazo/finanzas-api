import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-operaciones-nuevo-pago',
  templateUrl: './operaciones-nuevo-pago.component.html',
  styleUrls: ['./operaciones-nuevo-pago.component.css']
})
export class OperacionesNuevoPagoComponent implements OnInit {
  time: any;
  time1: any;
  buques: any[] = [];
  tipoArribo = [{id: 1, descripcion : 'Regular'},{id: 2, descripcion : 'Forzoso'},{id: 3, descripcion : 'Combustible'},{id: 4, descripcion : 'Imprevisto'},{id: 5, descripcion : 'Reparación'}];
  tipoTrafico = [{id: 1, descripcion : 'Alta'},{id: 2, descripcion : 'Cabotaje'}];
  tipoActividad = [{id: 1, descripcion : 'Comercial'},{id: 2, descripcion : 'Pesquera'},{id: 3, descripcion : 'Riberño'}];
  tipoArancel = [{id: 1, descripcion : 'Atraque'},{id: 2, descripcion : 'Puerto Fijo'},{id: 1, descripcion : 'Puerto Variable'}];
  pageAtraque = 1;
  dataAtraque = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'La junta',
      total: 10000,
      estado: 'Pendiente'
    }
  ];
  pagePuerto = 1;
  dataPuerto = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'La junta',
      total: 10000,
      estado: 'Pendiente'
    }
  ];
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
    private http: HttpClient,
    private auth: AuthService) { }

  ngOnInit(): void {
      $('#fecha-primer-cabo').datepicker();
      $('#fecha-ultimo-cabo').datepicker();
      $('.clockpicker').clockpicker({donetext: 'Aceptar'});
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
