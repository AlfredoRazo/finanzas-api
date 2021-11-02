import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginateService } from '@serv/paginate.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

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
  bl:any;
  fechaini:any;
  fechafin:any;

  constructor(private pagina: PaginateService,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.getData();
    $('#fecha-inis').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechaini = date } });
    $('#fecha-fins').datepicker({ dateFormat: 'dd-mm-yy', onSelect: (date: any) => { this.fechafin = date } });
  }

  getData(): void {
    let query = '';
    if(this.bl){
      query += `&BL=${this.bl}`;
    }
    if(this.fechaini && this.fechafin){
      query += `&fechaInicial=${this.fechaini}&fechaFin=${this.fechafin}`;
    }
    this.spinner.show();
    this.http.get(`https://pis-api-recinto.azurewebsites.net/api/inventario?t=${query}`).subscribe((res: any) => {
      
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
