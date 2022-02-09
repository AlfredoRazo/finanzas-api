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
          } else {
            this.errorMsj = 'El token de autorización es requerido';
            this.spinner.hide();
          }
        }, error => { this.spinner.hide() });
    }else{
      let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiNDI5IiwiaWRBcHAiOiIxOSIsIm5vbUFwcCI6IlJlY2ludG8gQVBJIiwiaWRSb2wiOiI2IiwiaWRSb2xBcHAiOiIyMDAxIiwiaWRQZXJzb25hIjoiNDQ2MSIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJhdXRvcmlkYWQiOiIwIiwibmJmIjoxNjQ0MzY0MDE1LCJleHAiOjE2NDQzOTI4MTUsImlhdCI6MTY0NDM2NDAxNSwiaXNzIjoiUElTIiwiYXVkIjoiQVBJTUFOIn0.dSjblyZn-fTLzEHO6peltaCeOGuF2jDQCw4A8-xk9SQ';
      this.tokenLogin(token);
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

    /*this.http.post(`${environment.endpointAuth}Usuario/v1/login`, payload).subscribe((res: any) => {
      console.log(res);
      if (res.error) {
        this.spinner.hide();
        this.hasError = true;
        this.errorMsj = res.mensaje;
      } else {
        // res.valor?.aplicaciones[0]?.url.split('?token=')[1]
        //recinto*/
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiNDI5IiwiaWRBcHAiOiIxOCIsIm5vbUFwcCI6IkZpbmFuemFzIiwiaWRSb2wiOiI2IiwiaWRSb2xBcHAiOiIxMDAxIiwiaWRQZXJzb25hIjoiNDQ2MSIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJuYmYiOjE2NDI1MjMwMjYsImV4cCI6MTY0MjU1MTgyNiwiaWF0IjoxNjQyNTIzMDI2LCJpc3MiOiJQSVMiLCJhdWQiOiJBUElNQU4ifQ.GNm3ziY0HP_cy7tdLUs8XNaIf48r_RCd7j5TWkM8aEk';
        //finanzas
        //let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tZWRpbmFAem9uYXplcm8uaW5mbyIsImlkVXN1IjoiNDI5IiwiaWRBcHAiOiIxOCIsIm5vbUFwcCI6IkZpbmFuemFzIiwiaWRSb2wiOiI2IiwiaWRSb2xBcHAiOiIxMDAxIiwiaWRQZXJzb25hIjoiNDQ2MSIsImlkRW1wcmVzYSI6Ijg1IiwiaWRDb250cmF0byI6IjEiLCJpZEFQSSI6IjciLCJuYmYiOjE2NDE1NzcyNDgsImV4cCI6MTY0MTYwNjA0OCwiaWF0IjoxNjQxNTc3MjQ4LCJpc3MiOiJQSVMiLCJhdWQiOiJBUElNQU4ifQ.3VnGypL6ggd-78jrpLfhNLHxs8pkhMMEgkyE3txZJ0I';
        this.tokenLogin(token);
      /*}
    }, error => {
      this.spinner.hide();
      this.hasError = true;
      this.errorMsj = error.error.Message;
    });*/


  }

  private tokenLogin(token: string): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    /*let endp = 'validar/permisos';
    if (environment.production) {
    }*/
    let endp = 'validar/v2/permisos';
    this.http.get(`${environment.endpointAuth}${endp}`, { headers: header }).subscribe((res: any) => {
      this.spinner.hide();
      const rol = this.role.getRolById(res.valor.idRolApp);
      //if (environment.production) {
        const user = {
          usuariokey: res.mensaje,
          idusuario: res.valor.usuario_Id,
          nombre: res.valor.usuario_Nombre,
          rol: rol,
          tipo: "TERMINAL",
          username: res.valor.usuario_Usuario,
          empresa: res.valor.empresa.nombre,
          empresaid: res.valor.empresa.id,
          rfc: res.valor.empresa.rfc,
          idRol: res.valor.idRolApp,
          idAPI: res.valor.idAPI,
          catToken: res.mensaje
        }
        this.authService.setSession({ token: token, userData: user });
        this.role.reditecByRole(rol);
      /*} else {
        this.http.post(environment.endpointCat + 'login', environment.catlogin).subscribe((rescat: any) => {
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
            idRol: res.valor.idRolApp,
            catToken: rescat.valor
          }
          this.authService.setSession({ token: token, userData: user });
          this.role.reditecByRole(rol);
        }, error => {
          this.spinner.hide();
        });

      }*/


    }, err => {
      this.errorMsj = err?.error?.mensaje ? err?.error?.mensaje : 'Token invalido';
      this.spinner.hide();
    });

  }

}
