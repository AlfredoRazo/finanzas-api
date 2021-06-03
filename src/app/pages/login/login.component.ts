import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hasError = false;
  errorMsj = '';
  user = {
    usuario: 'root',
    password: 'root'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: any): void {
    if(form.value.usuario === this.user.usuario && form.value.password === this.user.password){
      this.authService.setSession({token: 'adsfafasdfasdfasd' , userData: { nombre: 'Usuario', primerApellido: 'Prueba', rol: 'Rol de Prueba'}});
      this.router.navigate(['/main']);
    }else{
      const payload = 
        {
          appkey: environment.appKey,
          username: form.value.usuario,
          password:  Md5.hashStr(form.value.password) 
      }
      this.http.post(environment.endpointUser + 'usuarios', payload).subscribe((res: any) => {
        if(res.error == 1){
          this.hasError = true;
        this.errorMsj = res.errorDesc;
        }else{
          this.authService.setSession({token: 'adsfafasdfasdfasd' , userData: { nombre: res.errorDesc, primerApellido: '', rol: 'Rol de Prueba'}});
          this.router.navigate(['/main']);
        }
        
      },error => {
        this.hasError = true;
        this.errorMsj = error.error.Message;
      });
      
    }

  }

}
