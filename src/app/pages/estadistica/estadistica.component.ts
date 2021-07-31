import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css']
})
export class EstadisticaComponent implements OnInit {
  submenu = 1;
  page = 1;
  data: any = [];
  detalle: any;

  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService, 
    private http: HttpClient) { }

  ngOnInit(): void {
    this.spinner.show();
    const user = this.auth.getSession();
    this.http.get(environment.endpointApi + 'estadodehechos?idEmpresa=' + user.userData.empresaid).subscribe((res: any) => {
      this.spinner.hide();
      if(res[0].error){

      }else{
        this.data = res[0];
      }
    }, error => {
      this.spinner.hide();

    });
  }

  setEntries(item: any): void{
    this.detalle = Object.entries(item);
  }

}
