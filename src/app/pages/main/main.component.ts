import { Component, OnInit } from '@angular/core';
import { AuthService } from '@serv/auth.service';
import { RoleService } from '@serv/role.service';
export interface CardMenu {
  titulo: string;
  icono: string;
  link: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  dash: CardMenu[] = [
   
   ];

  constructor(private auth: AuthService, private role: RoleService) { }

  ngOnInit(): void {
    this.dash = this.role.getMenuByRole(this.auth.getSession().userData.rol);
  }

}
