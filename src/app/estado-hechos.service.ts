import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EstadoHechosService {
  apiid: string;
  constructor(private http: HttpClient, private auth: AuthService) { 
    this.apiid = this.auth.getSession().userData.idAPI;
  }

  getByBuqueViaje(buque: string, viaje: string): Observable<any>{
    return this.http.get(`${environment.endpointEstadoHechos}buques?buque=${encodeURI(buque)}&viaje=${encodeURI(viaje)}&idAPI=${this.apiid}`);
  }
}
