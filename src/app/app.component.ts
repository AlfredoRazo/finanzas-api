import { Component } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'facturacion';
  onActivate(event: any) {
    window.scroll(0, 0);
  }
  constructor(
    private bnIdle: BnNgIdleService,
    private auth: AuthService
   
    ) { // initiate it in your component constructor
    /*this.bnIdle.startWatching(3600).subscribe((res) => {
      if(res) {
        this.auth.closeSession();
      }
    })*/
  }
}
