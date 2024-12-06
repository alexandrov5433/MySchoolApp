import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';
import parseServerMsg from '../util/parseServerMsg';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn: WritableSignal<boolean> = signal(true); //TODO change to default 'false', just testing
  private userAuthStat: WritableSignal<string> = signal('teacher'); //student, parent, teacher  //TODO change to default '', just testing
  private userId: WritableSignal<string> = signal('');

  constructor(private http: HttpClient) { }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  get userAuthStatus(): string {
    return this.userAuthStat();
  }
  
  get user_Id(): string {
    return this.userId();
  }

  login(formData: FormData, status: string): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        if (!status) {
          throw new Error(`UserService: Status is not of type string or is an empty string. Status: "${status}"`);
        }
        this.http.post(`${env.restUrlBase}/user/login`, formData, {
          responseType: 'json',
          withCredentials: true
        }).subscribe({
          next: (val) => {
            const user_id = parseServerMsg(val as string).user_id || '';
            console.log('login user_id:', user_id);
            
            this.userId.set(user_id);
            subscriber.next(val);
          },
          error: (err) => {
            subscriber.error(err)
          },
          complete: () => {
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

  logout(): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/user/logout`, {
          responseType: 'json',
          withCredentials: true
        }).subscribe({
          next: (val) => {
            subscriber.next(val);
          },
          error: (err) => {
            subscriber.error(err)
          },
          complete: () => {
            this.isLoggedIn.set(false);
            this.userAuthStat.set('');
            this.userId.set('');
            subscriber.complete();
          },
        });
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
        this.http.post(`${env.restUrlBase}/user/register`, formData, {
          responseType: 'json',
          withCredentials: true,
        }).subscribe({
          next: (val) => {
            const user_id = parseServerMsg(val as string).user_id || '';
            this.userId.set(user_id);
            subscriber.next(val)
          },
          error: (err) => {
            subscriber.error(err)
          },
          complete: () => {
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
        this.http.post(`${env.restUrlBase}/application`, formData, {
          responseType: 'json',
          withCredentials: true,
        }).subscribe({
          next: val => subscriber.next(val),
          error: err => subscriber.error(err),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }
}
