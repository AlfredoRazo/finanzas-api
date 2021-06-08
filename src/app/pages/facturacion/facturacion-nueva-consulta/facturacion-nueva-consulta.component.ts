import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facturacion-nueva-consulta',
  templateUrl: './facturacion-nueva-consulta.component.html',
  styleUrls: ['./facturacion-nueva-consulta.component.css']
})
export class FacturacionNuevaConsultaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  submit(form : any): void{
    console.log(form.value);

  }

}
