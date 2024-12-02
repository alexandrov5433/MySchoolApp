import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return new Observable((subscriber) => {
      try {
        if (!status) {
          throw new Error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
        }
        //TODO http req comes here
        this.isLoggedIn = true;
        this.userAuthStat = status;
        subscriber.complete();
        // setTimeout(() => {
        //   subscriber.complete();
        //   // subscriber.error(new Error('Checking slowly.'));
        // }, 2000);
        // throw new Error('asdadsasd');
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  logout() {
    return new Observable((subscriber) => {
      try {
        // if (!status) {
        //   throw new Error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
        // }
        //TODO http req comes here
        this.isLoggedIn = false;
        this.userAuthStat = null;
        subscriber.complete();
      } catch (e) {
        subscriber.error(e);
      }
    });
  }
}
