import { HttpClient } from '@angular/common/http';
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

  getPersonal(): void{
    this.spinner.show();
    this.http.get(`${environment.endpointRecinto}funcionarios`).subscribe((res: any) =>{
      this.personal = res.datos;
      this.spinner.hide();
    },err =>{this.spinner.hide();});
  }

}
