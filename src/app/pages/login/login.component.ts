import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5/dist/md5';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '@serv/role.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  siteKey = environment.googleCaptchaKey;
  access = !environment.production;
  isEmbeded = environment.isEmbeded;
  recaptcha: any;
  token = '';
  hasError = false;
  errorMsj = '';
  user = {
    usuario: 'root',
    password: 'root'
  };

  constructor(
    private activeRoute: ActivatedRoute,
    private role: RoleService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.isEmbeded) {

      this.spinner.show();
      this.activeRoute.queryParams
        .subscribe(params => {
          if (params.token) {
            this.tokenLogin(params.token);
          }else{
            this.errorMsj ='El token de autorización es requerido';
              this.spinner.hide();
          }
        },error =>{this.spinner.hide()});
    }
  }

  handleSuccess(evt: any): void {
    this.token = evt;
    this.access = true;
  }

  onSubmit(form: any): void {
    const payload =
    {
      idContrato: 0,
      usuario: form.value.usuario,
      password: form.value.password
    }
    this.spinner.show();

    this.http.post(`${environment.endpointAuth}Usuario/v1/login`, payload).subscribe((res: any) => {
      
      if (res.error) {
        this.spinner.hide();
        this.hasError = true;
        this.errorMsj = res.mensaje;
      } else {
        this.tokenLogin(res.valor?.aplicaciones[0]?.url.split('?token=')[1]);
      }
    }, error => {
      this.spinner.hide();
      this.hasError = true;
      this.errorMsj = error.error.Message;
    });


  }

  private tokenLogin(token: string): void{
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    this.http.get(`${environment.endpointAuth}validar/permisos`, { headers: header }).subscribe((res: any) => {
      this.http.post(environment.endpointCat + 'login', environment.catlogin).subscribe((rescat: any) => {
        console.log(res);
        this.spinner.hide();
        const rol = this.role.getRolById(res.valor.idRolApp);
        const user = {
          usuariokey: res.mensaje,
          idusuario: res.valor.usuario_Id,
          nombre: res.valor.usuario_Nombre,
          rol: rol,
          tipo: "TERMINAL",
          username: res.valor.usuario_Usuario,
          empresa: res.valor.empresa_Nombre,
          empresaid: res.valor.empresa_Id,
          rfc: res.valor.empresa_Rfc,
          catToken: rescat.valor
        }
        this.authService.setSession({ token: token, userData: user });
        this.role.reditecByRole(rol);
      }, error => {
        this.spinner.hide();
      });

    }, err => {
      this.errorMsj = err?.error?.mensaje ? err?.error?.mensaje :'Token invalido';
      this.spinner.hide();
    });

  }

}
