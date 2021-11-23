import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  downloadPdf(data: any, spinner: any = undefined): void {
    const doc = new jsPDF('p','mm',[297, 210]);
    const options = {
      background: 'white',
      scale: 3,
      scrollY: 0,
      useCORS: true,
      pagesplit: true
    };
    html2canvas(data, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      const pageHeight = 280;
      
      const bufferX = 15;
      let bufferY = 10;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      let pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width);
      if(pdfHeight > 297){
        pdfHeight -= 65
      }
      let heightLeft = pdfHeight;
      let heightLeftTotal = pdfHeight;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      let pagina =1;
      let total = 1;
      heightLeft -= pageHeight;
      heightLeftTotal -= pageHeight;
      doc.setFontSize(7);
       //print number bottom right
      while (heightLeftTotal >= 0) {
        heightLeftTotal -= pageHeight;
        total++;
      }
      doc.text('Pagina ' + pagina + '/' + total, 190,280 );
      pagina ++;
      while (heightLeft >= 0) {
        bufferY = heightLeft - pdfHeight
        doc.addPage();
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        doc.text('Pagina ' + pagina + '/' + total, 190,280 );
        pagina ++;
      }
      return doc;
    }).then((docResult) => {
      if(spinner){
        spinner.hide();
      }
      docResult.save(`${new Date().toISOString()}_formato.pdf`);
    });
  }
  
  
}
