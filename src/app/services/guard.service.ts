import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    public auth: AuthService, 
    public router : Router) { }

  canActivate(): boolean {
    if(!this.auth.isAuthenticated()){
      this.router.navigate(['/']);
    }
    return this.auth.isAuthenticated();
  }

}
