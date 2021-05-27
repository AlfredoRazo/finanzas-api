import { Injectable } from '@angular/core';
export interface AuthData {
  token: string;
  userData: any;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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
  }
}
