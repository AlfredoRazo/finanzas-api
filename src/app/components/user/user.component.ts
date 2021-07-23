import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  rutas: any = [];
  user: any;
  isEmbeded = environment.isEmbeded;
  constructor(
    private router: Router,
    private activedRouter: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    let aux = '';
    this.router.url.split('/').forEach((item, index, array) => {
      if (index != 0) {
        if(item !== 'main'){
        aux += '/' + item;
        this.rutas.push({
          url: aux, name: this.toTitleCase(
            item
            .split('-').join(' ')
            .replace('facturacion', 'facturación')
            .replace('proteccion', 'protección')
            )
        });
      }
    }
    });
    this.user = this.authService.getSession().userData;
  }

  closeSession(): void {
    this.authService.closeSession();
  }

  toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
