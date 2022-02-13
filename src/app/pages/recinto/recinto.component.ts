import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

//Se intentó tener un orden en los endpoint, pero el backend esta desorganizado
@Component({
  selector: 'app-recinto',
  templateUrl: './recinto.component.html',
  styleUrls: ['./recinto.component.css']
})
export class RecintoComponent implements OnInit {
  submenu = 1;
  manifiesto = '';
  manifiestoData: any;

  constructor(private http: HttpClient,private spinner: NgxSpinnerService, private auth: AuthService) { }
  ngOnInit(): void {
  }
  consultarManifiesto(): void {
    this.spinner.show();
    let apiid = this.auth.getSession().userData.idAPI;
    let service = environment.isQa ? `${environment.endpointRecinto}/api/consultaManifiesto?Manifiesto=${this.manifiesto}` : `${environment.endpointRecinto}/api/manifiesto/v1/num/${this.manifiesto}?idAPI=${apiid}`;
    this.http.get(service).subscribe((res: any) => {
      this.manifiestoData = environment.isQa ? res[0]:res.datos;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

}
