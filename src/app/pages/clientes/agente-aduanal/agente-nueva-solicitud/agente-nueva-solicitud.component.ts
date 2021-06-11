import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import buques from 'src/assets/buques.json';
declare var $: any;

@Component({
  selector: 'app-agente-nueva-solicitud',
  templateUrl: './agente-nueva-solicitud.component.html',
  styleUrls: ['./agente-nueva-solicitud.component.css']
})
export class AgenteNuevaSolicitudComponent implements OnInit {

  public buque: any;
  
  search:any = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => 
        term.length < 2 ? []
        : buques.filter( (v: any) => v.nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    );
    formatter = (x: {nombre: string}) => x.nombre;
  page = 1;
  data = [
    {
      manifiesto: 123412,
      marca: 'Marca',
      embalaje: 'Embalaje',
      piezas: '10',
      peso: '2 toneladas',
      unidades: '1000'
    }
  ];
  tipoServicio = [
    {id : 'Contenedores', descripcion: 'Contenedores' },
    {id : 'Carga suelta', descripcion: 'Carga suelta' }
  ];
  tipoTramite = [
    {id : 'Importación', descripcion: 'Importación' },
    {id : 'Exportación', descripcion: 'Exportación' },
    {id : 'Transbordo', descripcion: 'Transbordo' }
  ];
  tipoSolicitud = [
    {id : 'Entrada', descripcion: 'Entrada' },
    {id : 'Salida', descripcion: 'Salida' },
    {id : 'Movimientos', descripcion: 'Movimientos' },
    {id : 'Liberación', descripcion: 'Liberación' },
  ];
  medioTransporte = [
    {id : 'Carretero', descripcion: 'Carretero' },
    {id : 'Ferroviario', descripcion: 'Ferroviario' },
    {id : 'Marítimo', descripcion: 'Marítimo' }
  ];
  agenciaAduanal = '';
  rfcCliente = '';
  nombreCliente = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.getSession().userData;
    this.agenciaAduanal = user.empresa;
    $('#fecha-servicio').datepicker();
    $('#fecha-arribo').datepicker();
    $('#fecha-inicio-operaciones').datepicker();
    $('#fecha-zarpe').datepicker();
    
  }
  
  searchName(): void{
    this.nombreCliente = 'PRUEBA CLIENTE';
  }

}
