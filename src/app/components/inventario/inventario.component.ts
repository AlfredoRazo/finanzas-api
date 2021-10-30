import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  total = 0;
  originalData: any[] = [];
  data: any[] = [];
  page = 1;
  collSize: any = 10;
  descPaginado = '';

  constructor(private pagina: PaginateService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.spinner.show();
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/inventario`).subscribe((res: any) => {
      
        this.total = res[0].length;
        this.originalData = [...res[0]];
        this.data = this.pagina.paginate([...this.originalData], this.collSize, this.page);
        console.log(this.data);
      
      this.spinner.hide();
    }, err => { this.spinner.hide(); });
  }
  paginado(evt: any = null): void {

    this.data = this.pagina.paginate(this.originalData, 10, this.page);
    this.descripcionPaginado();
  }
  descripcionPaginado(): void {
    var numberOfPages = Math.floor((this.total + this.collSize - 1) / this.collSize);
    var start = (this.page * this.collSize) - (this.collSize - 1);
    var end = Math.min(start + this.collSize - 1, this.total);
    this.descPaginado = `Registros del <b>${start}</b> al <b>${end}</b>`;
  }

}
