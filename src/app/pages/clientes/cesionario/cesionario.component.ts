import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@serv/auth.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cesionario',
  templateUrl: './cesionario.component.html',
  styleUrls: ['./cesionario.component.css']
})
export class CesionarioComponent implements OnInit {
  submenu = 1;
  loading = false;
  errorMsj = '';
  hasError = false;
  hasSuccess = false;
  successMsj = '';
  arrayBuffer: any;
  filelist: any;
  pageHechos = 1;
  dataHechos: any[] = [];
  pageManiobra = 1;
  dataManiobra: any[] = [
  ]

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private auth: AuthService) { }

  ngOnInit(): void {
  }

  loadHechos(event: any): void {
    this.spinner.show();
    this.hasError = false;
    this.errorMsj = '';
    const file = event.target.files[0];
    const ext = event.target.files[0].name.split('.').pop().toUpperCase();
    if (ext === 'XLSX') {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.delete_row(worksheet, 0);
        this.delete_row(worksheet, 0);
        this.delete_row(worksheet, 0);
        this.delete_row(worksheet, 0);
        let error = 0;
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        arraylist.splice(-1, 1);
        this.dataHechos = arraylist.map((item: any) => {

          return {
            codigo: item['Código'],
            buque: item['Buque'],
            tipobuque: item['Tipo de Buque'],
            viaje: item['Viaje'],
            operadora: '',
            tipotrafico: item['Tipo de Tráfico'],
            tipomaniobra: item['T. Maniobra'],
            producto: item['Producto'],
            tipoproducto: item['T.Producto'],
            tramo: item['Tramo'],
            trafico: item['Tráfico'],
            importacion: item['Importación'],
            exportacion: item['Exportación'],
            altentrada: 0,
            altsalida: 0,
            caboentrada: item['Entrada'],
            cabosalida: item['Salida'],
            transentrada: item['Entrada_1'],
            transsalida: item['Salida_1'],
            total: item['Total']
          };
        });
        this.spinner.hide();
        if (error > 0) {
          this.dataHechos = [];
          this.hasError = true;
          this.errorMsj = 'No se encuentra en el formato requerido su archivo, favor de verificar';

        }
        this.spinner.hide();
      }
    } else {
      this.hasError = true;
      this.errorMsj = 'Archivo no valido, requiere ingresar un archivo xlsx';
      this.spinner.hide();
    }
  }

  uploadDataHechos(): void {
    const user = this.auth.getSession();

    this.spinner.show();
    const payload = {
      appkey: environment.appKey,
      usuariokey: '',
      idusuario: user.userData.idusuario,
      registros: this.dataHechos
    }
    this.http.post(environment.endpointApi + 'estadodehechos', payload).subscribe((res: any) => {
      this.spinner.hide();
      if (res[0].error !== 0) {
        this.hasSuccess = false;
        this.successMsj = ''
        this.hasError = true;
        this.errorMsj = res[0].errorDesc;
      } else {
        this.hasError = false;
        this.errorMsj = '';
        this.hasSuccess = true;
        this.dataHechos = [];
        this.successMsj = res[0].message ? res[0].message : 'Se guardó correctamente su documento';
      }
    }, error => {
      this.spinner.hide();
      this.hasError = true;
      this.errorMsj = error.error.Message;
    })
  }
  loadManiobras(event: any): void {
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.delete_row(worksheet, 0);
      this.delete_row(worksheet, 0);
      this.delete_row(worksheet, 0);

      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.dataManiobra = arraylist.map((item: any) => {
        return {
          buque: item['__EMPTY_1'],
          viaje: item['__EMPTY_2'],
          operadora: item['__EMPTY_3'],
          tipoTrafico: item['__EMPTY_4'],
          recintoES: item['__EMPTY_5'],
          tipoManiobra: item['__EMPTY_6'],
          producto: item['__EMPTY_7'],
          embalaje: item['__EMPTY_8'],
          bulto: item['__EMPTY_9'],
          tipoProducto: item['__EMPTY_10'],
          tramo: item['__EMPTY_11'],
          trafico: item['__EMPTY_12']
        };
      });
    }
  }


  ec(r: any, c: any) {
    return XLSX.utils.encode_cell({ r: r, c: c });
  }
  delete_row(ws: any, row_index: any) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for (var R = row_index; R < variable.e.r; ++R) {
      for (var C = variable.s.c; C <= variable.e.c; ++C) {
        ws[this.ec(R, C)] = ws[this.ec(R + 1, C)];
      }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
  }

}
