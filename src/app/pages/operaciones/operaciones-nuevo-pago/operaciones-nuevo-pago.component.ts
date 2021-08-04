import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
declare var $: any;
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
  selector: 'app-operaciones-nuevo-pago',
  templateUrl: './operaciones-nuevo-pago.component.html',
  styleUrls: ['./operaciones-nuevo-pago.component.css']
})
export class OperacionesNuevoPagoComponent implements OnInit {
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
  numeroviaje = '';
  tipobuque = '';
  tramo = '';
  hasError = false;
  success = false;
  indexEdit: any;
  dataEdit: any;
  noConsulta = '';
  cantidadPiezas = '';
  horaini:any;
  horafin:any;
  isHora = false;
  catTramo = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20'
  ]
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
    this.getClientes();
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
      this.conceptos = res.valores.filter((item: any) =>{ return item.clave == '000000000000000001' || item.clave == '000000000000000002'});
    }, err => { this.spinner.hide() });
  }
  getUnidadesMedida(): void {
    this.http.get(this.catalogos + 'unidadesmedida').subscribe((res: any) => {
      this.unidadesmedida = res.valores;
    });
  }

  selectConcepto(value: any) {
    this.concepto = value;
    this.data = this.data.map(item=>{item.concepto = value});
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
    this.tabledat.unidadcantidadtxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadcantidad})?.valor1;
    this.tabledat.unidadvolumentxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadvolumen})?.valor1;
    this.tabledat.unidadpesotxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadpeso})?.valor1;
    this.tabledat.concepto = concepto.valor1;
    this.tabledat.material = this.concepto;
    this.data.push(this.tabledat);
    this.tabledat = {} as FacturaForm;
  }
  guardarEditData(): void {
    const concepto = this.conceptos.find(item => { return item.clave == this.concepto });
    this.tabledat.concepto = concepto.valor1;
    this.tabledat.material = this.concepto;
    this.tabledat.unidadcantidadtxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadcantidad})?.valor1;
    this.tabledat.unidadvolumentxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadvolumen})?.valor1;
    this.tabledat.unidadpesotxt = this.unidadesmedida.find(item =>{return item.clave === this.tabledat.unidadpeso})?.valor1;
    
    this.data[this.indexEdit] = this.tabledat;
    this.tabledat = {} as FacturaForm;
  }
  removeData(index: any): void {
    this.data.splice(index, 1);
  }

  getBuques(): void {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getSession().userData.catToken}`
    });
    this.http.get(environment.endpointCat + 'buques', { headers: header }).subscribe((res: any) => {
      this.buques = res.valor;
    }, error => { });
  }

   initDatePickers() {
    $('#hora-ini').clockpicker({donetext: 'Aceptar', afterDone: (hour: any) =>{
      var ini: any = document.getElementById('input-hora-ini');
      this.horaini = ini.value}});
    $('#hora-fin').clockpicker({donetext: 'Aceptar', afterDone: (hour: any) =>{
      var fin: any = document.getElementById('input-hora-fin');
      this.horafin = fin.value}});
    $('#fecha-ini').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechaini = date; this.getDays(); } });
    $('#fecha-fin').datepicker({ dateFormat: 'yy-mm-dd', onSelect: (date: any) => { this.fechafin = date; this.getDays(); } });
   
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getDays() {
    if (this.fechaini && this.fechafin && this.isFecha) {
      var date1 = new Date(this.fechaini);
      var date2 = new Date(this.fechafin);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) + 1;
      this.tabledat.cantidad = Difference_In_Days.toString();
    }
  }
  setTime(){
    if(this.isHora && this.horaini && this.horafin){
      const timeStart = new Date (new Date().setHours(this.horaini.split(':')[0],this.horaini.split(':')[1])).getHours();
      const timeEnd = new Date(new Date().setHours(this.horafin.split(':')[0],this.horafin.split(':')[1])).getHours();
      let hourDiff = timeEnd - timeStart;    
     this.tabledat.cantidad = hourDiff.toString();
    }

  }
  buqueSelect(): void {
    if (this.buque.tonelajeBruto) {
      console.log(this.buque);
      this.tonelajeNeto = this.buque.tonelajeNeto;
      this.tonelajeMuerto = this.buque?.tonelajeMuerto;
      this.eslora = this.buque.eslora;
      this.tipobuque = this.buque?.tipoBuque?.nombreMigracion
      this.tabledat.peso = this.buque?.tonelajeBruto?.toString();
    }
  }

  generarPago(): void {
    this.spinner.show();
    const payload = {
      detalle: this.data,
      tipo: parseInt(this.concepto),
      clienteSolicita: this.solicitados?.claveSAP,
      clientefacturar: this.facturaa?.claveSAP,
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
      tipoBuque: this.tipobuque,
      tramo: this.tramo,
      piezas: this.cantidadPiezas
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
}
