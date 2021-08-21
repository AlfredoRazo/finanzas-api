import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-personal-recinto',
  templateUrl: './personal-recinto.component.html',
  styleUrls: ['./personal-recinto.component.css']
})
export class PersonalRecintoComponent implements OnInit {
  personal: any[] = [];
  constructor(private auth: AuthService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getPersonal();
  }

  getPersonal(): void {
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}funcionarios`).subscribe((res: any) => {
      this.personal = res.datos;
      this.spinner.hide();
    }, err => { this.spinner.hide(); });
  }

  getDocumento(idDoc: string): void {
    this.spinner.show();
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`
    });
    this.http.get(`${environment.endpointDoc}${idDoc}`, { headers: header }).subscribe((res: any) => {
      this.spinner.hide();
      if (!res.error) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE workaround
          var byteCharacters = atob(res.datos.contenido);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: res.datos.mimeType });
          window.navigator.msSaveOrOpenBlob(blob, res.datos.nombre);
        } else {
          const linkSource =
            `data:${res.datos.mimeType};base64,${res.datos.contenido}`;
          const downloadLink = document.createElement('a');
          const fileName = res.datos.nombre;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      }
    }, err => { this.spinner.hide();});
  }

}
