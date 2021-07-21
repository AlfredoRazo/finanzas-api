import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.css']
})
export class RecintoComponent implements OnInit {
  public buque: any;
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
  submenu = 1;
  page = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      cliente: 'La junta',
      tipoSolicitud: 'Pago de aranceles',
      estado: 'Pendiente'
    }
  ];

  constructor(private auth: AuthService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getBuques();
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
