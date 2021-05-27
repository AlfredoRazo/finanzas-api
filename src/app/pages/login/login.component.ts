import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      this.hasError = true;
      this.errorMsj = 'Credenciales incorrectas.';
    }

  }

}
