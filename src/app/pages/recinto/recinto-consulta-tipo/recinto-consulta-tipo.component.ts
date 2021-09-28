import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var $: any;
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export interface FacturaForm {
  material: string;
  cantidad: string;
  unidadcantidad: string;
  unidadcantidadtxt: string;
  volumen: string;
  unidadvolumen: string;
  unidadvolumentxt: string;
  peso: string;
  unidadpeso: string;
  unidadpesotxt: string;
  concepto: string;
}
@Component({
  selector: 'app-recinto-consulta-tipo',
  templateUrl: './recinto-consulta-tipo.component.html',
  styleUrls: ['./recinto-consulta-tipo.component.css']
})
export class RecintoConsultaTipoComponent implements OnInit {
  catalogos = environment.endpoint + 'sapCatalogos?catalogo='
  tabledat: FacturaForm = {} as FacturaForm;
  clientes: any[] = [];
  conceptos: any[] = [];
  unidadesmedida: any[] = [];
  data: any[] = [];
  buque: any;
  buques: any[] = [];
  isFecha = false;
  fechaini: any;
  fechafin: any;
  tonelajeNeto = '';
  tonelajeMuerto = '';
  eslora = '';
  concepto = '';
  bl = '';
  hasError = false;
  success = false;
  indexEdit: any;
  dataEdit: any;
  noConsulta = '';
  cantidadPiezas = '';
  horaini: any;
  horafin: any;
  isHora = false;
  numeroviaje: any;
  tarifa = '';
  facturardata:any = [];
  solicitadospor: any = [];
  catTarifa: any = [
    { clave: '00', descripcion: 'N/A' },
    { clave: 'CG1', descripcion: 'Tarifa 1' },
    { clave: 'CG2', descripcion: 'Tarifa 2' },
    { clave: 'CG3', descripcion: 'Tarifa 3' }
  ];
  buscarEmp = '';
  buscarFacturar = '';
  solicitadoDetalle:any;
  facturaraDetalle: any;
  search: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.buques.filter((v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );
  formatter = (x: { nombre: string }) => x.nombre;
  solicitados: any;
  facturaa: any;
  searchCliente: any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term.length < 2 ? []
          : this.clientes.filter((v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )
    );

  constructor(private http: HttpClient,
    private auth: AuthService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.initDatePickers();
    //this.getClientes();
    this.getConceptos();
    this.getUnidadesMedida();
    this.getBuques();
  }

  getClientes(): void {
    this.spinner.show();
    this.http.get(`${environment.endpoint}clientes`).subscribe((res: any) => {
      this.clientes = res[0];
      this.spinner.hide();
    }, err => { this.spinner.hide() });
  }
  getConceptos(): void {

    this.http.get(`${environment.endpoint}sapcatalogos?catalogo=materiales`).subscribe((res: any) => {
      this.conceptos = res.valores;
    }, err => { this.spinner.hide() });
  }

  getUnidadesMedida(): void {
    this.http.get(this.catalogos + 'unidadesmedida').subscribe((res: any) => {
      this.unidadesmedida = res.valores;
      if (res.valores) {
        this.unidadesmedida = this.unidadesmedida.filter(item => {
          return (item.clave == '10' || item.clave == 'ST' || item.clave == 'KG')
        });
      }
    });
  }

  selectConcepto(value: any) {
    this.concepto = value;
    this.data = this.data.map(item => { item.concepto = value });
    switch (value.trim()) {
      case '000000000000000003':
      case '000000000000000060':
        this.isFecha = true;
        this.isHora = false;
        this.tabledat.unidadcantidad = '10';
        this.tabledat.unidadpeso = 'KG';
        break;
      case '000000000000000004':
        this.tabledat.unidadcantidad = 'ST';
        this.tabledat.unidadpeso = 'KG';
        this.isFecha = false;
        this.isHora = false;
        break;
      case '000000000000000001':
      case '000000000000000063':
        this.isFecha = true;
        this.isHora = false;
        this.tabledat.unidadcantidad = '10';
        this.tabledat.unidadvolumen = 'M/E';
        this.tabledat.unidadpeso = 'TRB';
        break;
      case '000000000000000018':
      case '000000000000000064':
        this.isHora = true;
        this.tabledat.unidadcantidad = 'H';
        this.tabledat.unidadvolumen = 'M/E';
        this.tabledat.unidadpeso = 'TRB';
        this.isFecha = false;
        break;
      case '000000000000000002':
        this.isHora = true;
        this.tabledat.unidadcantidad = 'H';
        this.tabledat.unidadvolumen = 'M/E';
        this.tabledat.unidadpeso = 'KG';
        this.isFecha = false;
        break;

      default:
        this.isHora = false;
        this.isFecha = false;
        break;
    }

  }

  guardarData(): void {
    const concepto = this.conceptos.find(item => { return item.clave == this.concepto });
    this.tabledat.unidadcantidadtxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadcantidad })?.valor1;
    this.tabledat.unidadvolumentxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadvolumen })?.valor1;
    this.tabledat.unidadpesotxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadpeso })?.valor1;
    this.tabledat.concepto = concepto.valor1;
    this.tabledat.material = this.concepto;
    this.data.push(this.tabledat);
    this.tabledat = {} as FacturaForm;
  }
  guardarEditData(): void {
    const concepto = this.conceptos.find(item => { return item.clave == this.concepto });
    this.tabledat.concepto = concepto.valor1;
    this.tabledat.material = this.concepto;
    this.tabledat.unidadcantidadtxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadcantidad })?.valor1;
    this.tabledat.unidadvolumentxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadvolumen })?.valor1;
    this.tabledat.unidadpesotxt = this.unidadesmedida.find(item => { return item.clave === this.tabledat.unidadpeso })?.valor1;

    this.data[this.indexEdit] = this.tabledat;
    this.tabledat = {} as FacturaForm;
  }
  removeData(index: any): void {
    this.data.splice(index, 1);
  }

  getBuques(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`
    });
    this.http.get(environment.endpointCat + 'buques', { headers: header }).subscribe((res: any) => {
      this.buques = res.valor;
    }, error => { });
  }

  initDatePickers() {
    $('#hora-ini').clockpicker({
      donetext: 'Aceptar', afterDone: (hour: any) => {
        var ini: any = document.getElementById('input-hora-ini');
        this.horaini = ini.value + ':00';
        this.getDays();
      }
    });
    $('#hora-fin').clockpicker({
      donetext: 'Aceptar', afterDone: (hour: any) => {
        var fin: any = document.getElementById('input-hora-fin');
        this.horafin = fin.value + ':00';
        this.getDays();
      }
    });
    $('#fecha-ini').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaini = date; this.getDays(); } });
    $('#fecha-fin').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechafin = date; this.getDays(); } });

  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getDays() {
    if (this.fechaini && this.fechafin) {
      let timein = '00:00:00';
      let timeen = '23:59:00';
      if (this.horaini) {
        timein = this.horaini;
      }
      if (this.horafin) {
        timeen = this.horafin;
      }
      const ini = dayjs(this.fechaini + 'T' + timein);
      const fin = dayjs(this.fechafin + 'T' + timeen);
      if (this.isFecha) {
        this.tabledat.cantidad = (fin.diff(ini, 'day') + 1).toString();
      }
      if (this.isHora) {
        this.tabledat.cantidad = fin.diff(ini, 'hours').toString()
      }
    }
  }
  buqueSelect(): void {
    if (this.buque.tonelajeBruto) {
      this.tonelajeNeto = this.buque.tonelajeNeto;
      this.tonelajeMuerto = this.buque?.tonelajeMuerto;
      this.eslora = this.buque.eslora;
      this.tabledat.peso = this.buque?.tonelajeBruto?.toString();
    }
  }

  generarPago(): void {
    this.spinner.show();
    const payload = {
      detalle: this.data,
      tipo: parseInt(this.concepto),
      clienteSolicita: this.solicitadoDetalle?.codigoSAP,
      clientefacturar: this.facturaraDetalle?.codigoSAP,
      nombrebuque: this.buque.nombre ? this.buque.nombre : this.buque,
      numeroviaje: this.numeroviaje,
      workorder: "",
      aduana: "",
      bl: this.bl,
      fechaentrada: this.fechaini,
      fechasalida: this.fechafin,
      horaentrada: this.horaini,
      horasalida: this.horafin,
      pedimento: "",
      recinto: "",
      tramo: "",
      piezas: this.cantidadPiezas,
      tipotarifa: this.tarifa
    };
    this.http.post(`${environment.endpointApi}facturacionGenerarOrden`, payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res[0]?.error == 1) {
        this.hasError = true;
        this.success = false;
      } else {
        this.hasError = false
        this.success = true;
        this.noConsulta = res[0].noConsulta;
        this.data = [];
      }
    }, error => { this.spinner.hide(); });
  }
  editData(index: any, item: any): void {
    this.tabledat = item;
    this.indexEdit = index;
  }
  buscarEmpresa(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas?buscar=${this.buscarEmp}&orden=idEmpresa&tipo_orden=ASC&pagina=1&registros_por_pagina=10`, { headers: header }).subscribe((res: any) => {
      if (!res.error) {
        this.solicitadospor = res.valor?.resultado;
      }
      
    }, error => { });
  }
  buscarEmpresaF(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas?buscar=${this.buscarEmp}&orden=idEmpresa&tipo_orden=ASC&pagina=1&registros_por_pagina=10`, { headers: header }).subscribe((res: any) => {
      if (!res.error) {
        this.facturardata = res.valor?.resultado;
      }
      
    }, error => { });

  }

  buscarDetalleEmpresa(tipo = 1): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().token}`,
    });
    //cambiar
    this.http.get(`${environment.endpointEmpresas}api/empresas/${this.solicitados.id}`, { headers: header }).subscribe((res: any) => {
      if(tipo === 1){
        this.solicitadoDetalle = res.datos;
      }else{
        this.facturaraDetalle = res.datos;
      }
      
    }, error => { });

  }
}
