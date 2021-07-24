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
            const header = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${params.token}`
            });
            this.http.get(environment.endpointAuth, { headers: header }).subscribe((res: any) => {
              this.http.post(environment.endpointCat + 'login', environment.catlogin).subscribe((rescat: any) => {
                this.spinner.hide();
                //const rol = this.role.getRolById(res.valor.idRolApp);
                const rol = 'ADMIN';
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
                
                this.authService.setSession({ token: environment.appKey, userData: user });
                this.role.reditecByRole(rol);
              }, error => {
                this.spinner.hide();
              });

            }, err => {
              this.errorMsj = err?.error?.mensaje ? err?.error?.mensaje :'Token invalido';
              this.spinner.hide();
            });
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
      appkey: environment.appKey,
      username: form.value.usuario,
      password: Md5.hashStr(form.value.password)
    }
    this.spinner.show();
    this.http.post(environment.endpointApi + 'usuarios', payload).subscribe((res: any) => {

      if (res.length === 1) {
        this.spinner.hide();
        this.hasError = true;
        this.errorMsj = res[0].errorDesc;
      } else {
        this.http.post(environment.endpointCat + 'login', environment.catlogin).subscribe((rescat: any) => {
          this.spinner.hide();
          res[0].catToken = rescat.valor;
          this.authService.setSession({ token: environment.appKey, userData: res[0] });
          this.role.reditecByRole(res[0].rol);
        }, error => {
          this.spinner.hide();
        });

      }
    }, error => {
      this.spinner.hide();
      this.hasError = true;
      this.errorMsj = error.error.Message;
    });


  }

}
