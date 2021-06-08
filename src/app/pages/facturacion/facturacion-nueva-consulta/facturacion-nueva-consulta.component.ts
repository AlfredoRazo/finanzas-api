import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-facturacion-nueva-consulta',
  templateUrl: './facturacion-nueva-consulta.component.html',
  styleUrls: ['./facturacion-nueva-consulta.component.css']
})
export class FacturacionNuevaConsultaComponent implements OnInit {
  errorMsj = '';
  hasError = false;
  hasSuccess = false;
  successMsj = '';

  constructor(
    private spinner: NgxSpinnerService,
    public http: HttpClient) { }

  ngOnInit(): void {
  }

  submit(form : any): void{
    this.spinner.show();
    this.http.post<any>(environment.endpoint + 'consultasap', form.value).subscribe(res => {
      this.spinner.hide();
      console.log(res);
      if(res[0].error){
        this.hasSuccess = false;
        this.successMsj = ''
        this.hasError = true;
        this.errorMsj = res[0].errorStr;
      }else{
        form.reset();
        form.resetForm();
        this.hasError = false;
        this.errorMsj = '';
        this.hasSuccess = true;
        this.successMsj = 'Se guardó correctamente, número de consulta : ' + res[0].noConsulta;
      }
    }, error => {
      this.spinner.hide();
    })

  }

}
