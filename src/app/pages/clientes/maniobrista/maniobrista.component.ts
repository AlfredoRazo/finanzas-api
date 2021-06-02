import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-maniobrista',
  templateUrl: './maniobrista.component.html',
  styleUrls: ['./maniobrista.component.css']
})
export class ManiobristaComponent implements OnInit {
  arrayBuffer: any;
  filelist: any;
  pageHechos = 1;
  dataHechos: any[] = [
  //  { codigo: 123, buque: 'Buque', tipoBuque: 'Tipo Buque', viaje: 'Viaje', tipoTrafico: 'Un tipo tráfico', tipoManiobra: 'Tipo Maniobra', producto: 'Producto', tipoProducto: 'Tipo Producto', tramo: 'Un tramo', trafico: 'Un tráfico', imp: 'Imp', exp: 'exp' },
  ];
  submenu = 1;
  pageManiobra = 1;
  dataManiobra: any[] = [
    //{ buque: 'Buque', viaje: 'Viaje', operadora: 'Operadora', tipoTrafico: 'Un tipo tráfico', recintoES: 'Recinto', tipoManiobra: 'Tipo Maniobra', producto: 'Un producto', embalaje: 'Un embalaje', bulto: '123', tipoProducto: 'Tipo Producto', tramo: 'Un tramo', trafico: 'Un tráfico' },
  ]
  pagePagos = 1;
  dataPagos = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'Pago de aranceles',
      total: '38987',
      estado: 'Pendiente',
      cfdi: ''
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  loadHechos(event: any): void {
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
      this.delete_row(worksheet, 0);
     
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      arraylist.splice(-1,1);
      /*arraylist.forEach(element => {
        if()
        
      });*/
      this.dataHechos = arraylist.map((item: any)=> {
        
        return  { 
          codigo: item['Código'], 
          buque: item['Buque'], 
          tipoBuque:item['Tipo de Buque'], 
          viaje: item['Viaje'], 
          tipoTrafico: item['Tipo de Tráfico'], 
          tipoManiobra: item['T. Maniobra'], 
          producto: item['Producto'], 
          tipoProducto: item['T.Producto'], 
          tramo:item['Tramo'], 
          trafico: item['Tráfico'], 
          imp: item['Importación'], 
          exp: item['Exportación'] };
      });


    }

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
    
      this.dataManiobra = arraylist.map((item: any)=> {
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
          trafico: item['__EMPTY_12']};
      });
    }
  }

   ec(r: any, c:any){
    return XLSX.utils.encode_cell({r:r,c:c});
  }
   delete_row(ws: any, row_index:any){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < variable.e.r; ++R){
      for(var C = variable.s.c; C <= variable.e.c; ++C){
        ws[this.ec(R,C)] = ws[this.ec(R+1,C)];
      }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
  }

}
