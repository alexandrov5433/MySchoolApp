import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn: boolean = false;
  private userAuthStat: string | null = null;
  constructor() { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  get userAuthStatus(): string | null {
    return this.userAuthStat;
  }

  loginAs(status: string | undefined | null) {
    if (!status) {
      console.error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
      return;
    }
    this.isLoggedIn = true;
    this.userAuthStat = status;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userAuthStat = null;
  }
}
