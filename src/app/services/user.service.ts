import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private userAuthStat: WritableSignal<string | null> = signal(null); //student, parent, teacher
  constructor(private http: HttpClient) { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  get userAuthStatus(): string | null {
    return this.userAuthStat();
  }

  login(status: string | undefined | null): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        if (!status) {
          throw new Error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
        }
        //TODO http req comes here
        this.isLoggedIn.set(true);
        this.userAuthStat.set(status);
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

  logout(): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        // if (!status) {
        //   throw new Error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
        // }
        //TODO http req comes here
        this.isLoggedIn.set(false);
        this.userAuthStat.set(null);
        subscriber.complete();
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  register(formData: FormData, status: string): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        if (this.isLoggedIn()) {
          throw new Error(`UserService: User with status "${this.userAuthStat()}" is already logged in.`);
        }
        if (!['parent', 'teacher'].includes(status)) {
          throw new Error(`UserService: User cannot register with status "${status}".`);
        }
        this.http.post('http://localhost:3000/user', formData, {
          responseType: 'json'
        }).subscribe({
          next: (val) => { console.log('Form next:', val);
          },
          error: (err) => {
            subscriber.error(err)        
          },
          complete: () => {
            console.log('SUCCESS');
            
            this.isLoggedIn.set(true);
            this.userAuthStat.set(status);
            subscriber.complete();
          },
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  apply(formData: FormData): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        if (this.isLoggedIn()) {
          throw new Error(`UserService: User with status "${this.userAuthStat()}" is already logged in.`);
        }
        this.http.post('http://localhost:3000/application', formData, {
          responseType: 'json'
        }).subscribe({
          next: (val) => { console.log('Form next:', val);
          },
          error: (err) => {
            subscriber.error(err)        
          },
          complete: () => {
            console.log('SUCCESS');
            subscriber.complete();
          },
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }
}
