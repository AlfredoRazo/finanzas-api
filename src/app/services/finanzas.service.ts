import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiNDI5IiwiaWRBcHAiOiIxOSIsIm5vbUFwcCI6IlJlY2ludG8gQVBJIiwiaWRSb2wiOiI2IiwiaWRSb2xBcHAiOiIyMDAxIiwiaWRQZXJzb25hIjoiNDQ2MSIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJhdXRvcmlkYWQiOiIwIiwibmJmIjoxNjQzNzU5ODQwLCJleHAiOjE2NDM3ODg2NDAsImlhdCI6MTY0Mzc1OTg0MCwiaXNzIjoiUElTIiwiYXVkIjoiQVBJTUFOIn0.ltpvh0eXoHEPPUH31hr9Ef3yZ4zAiiG2cmb8MksCQ0c';
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });
  constructor(private http: HttpClient, private auth: AuthService) { 
  }

  get(url: string): Observable<any>{
    return this.http.get(`${environment.endpointApi}${url}`,{ headers: this.header });
  }
  post(url: string, payload: any): Observable<any>{
    return this.http.post(`${environment.endpointApi}${url}`,payload,{ headers: this.header });
  }

  get2(url: string): Observable<any>{
    //return this.http.get(`${environment.endpoint}${url}`,{ headers: this.header });
    return this.http.get(`${environment.endpoint}${url}`);
  }
  post2(url: string, payload: any): Observable<any>{
    //return this.http.post(`${environment.endpoint}${url}`,payload,{ headers: this.header });
    return this.http.post(`${environment.endpoint}${url}`,payload);
  }

  getCatalogos(catalogo: string): Observable<any>{
    return this.http.get(environment.endpoint + 'sapCatalogos?catalogo=' + catalogo, { headers: this.header });
  }
  
}
