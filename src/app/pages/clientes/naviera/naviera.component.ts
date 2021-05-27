import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-naviera',
  templateUrl: './naviera.component.html',
  styleUrls: ['./naviera.component.css']
})
export class NavieraComponent implements OnInit {
  page = 1;
  data = [
    {
      id: 123,
      fecha: '28/05/2021',
      concepto: 'Concepto',
      estado: 'Pendiente'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
