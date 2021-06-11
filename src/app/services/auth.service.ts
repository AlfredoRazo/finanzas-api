import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
export interface AuthData {
  token: string;
  userData: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  setSession(session: AuthData): void {
    localStorage.setItem('sessionData', JSON.stringify(session));
  }

  getSession(): AuthData {
    const data = localStorage.getItem('sessionData');
    return data ? JSON.parse(data) : {} as AuthData;
  }

  isAuthenticated(): boolean{
    const data = localStorage.getItem('sessionData');
    return data ? true: false;
  }
  
  public closeSession(): void {
    localStorage.removeItem('sessionData');
    this.router.navigate(['/']);
  }
}
