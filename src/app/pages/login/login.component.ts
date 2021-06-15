import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Md5 } from 'ts-md5/dist/md5';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  siteKey = environment.googleCaptchaKey;
  access = !environment.production;
  recaptcha: any;
  token = '';
  hasError = false;
  errorMsj = '';
  user = {
    usuario: 'root',
    password: 'root'
  };

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
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
        this.http.post(environment.endpointCat +'login',environment.catlogin).subscribe((rescat: any) =>{
          this.spinner.hide();
          res[0].catToken = rescat.valor;
          this.authService.setSession({ token: environment.appKey, userData: res[0] });
          this.router.navigate(['/main']);
        },error=>{
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
