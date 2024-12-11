import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';
import parseServerMsg from '../util/parseServerMsg';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedIn: WritableSignal<boolean> = signal(false);
  private userAuthStat: WritableSignal<string> = signal('');
  private userId: WritableSignal<string> = signal('');
  private userData: WritableSignal<User | null> = signal(null);

  userIdChangeEmitter = new EventEmitter<string>();

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

  get user_data(): User | null {
    return this.userData();
  }

  setPropsFromLocalStorageIfCookieExists(userCookieExists: boolean) {
    if (userCookieExists && !this.isLoggedIn()) {
      const userData = this.getUserDataFromLocalStorage();
      if (userData) {
        this.isLoggedIn.set(true);
        this.userAuthStat.set(userData.userStatus);
        this.userId.set(userData.userId);
        this.userIdChangeEmitter.emit(userData.userId);
      }
    }
  }

  private setUserDataInLocalStorage() {
    const userId = this.userId();
    const userStatus = this.userAuthStat();
    window.localStorage.setItem('user', JSON.stringify({userId, userStatus}));
  }

  private clearLocalStorage() {
    window.localStorage.clear();
  }

  private getUserDataFromLocalStorage() {
    const userData = window.localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return false;
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
            this.userIdChangeEmitter.emit(this.user_Id);
            this.setUserDataInLocalStorage();
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
            this.userIdChangeEmitter.emit(this.user_Id);
            this.clearLocalStorage();
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
            this.userIdChangeEmitter.emit(this.user_Id);
            this.setUserDataInLocalStorage();
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

  getUserData(userId: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/profile/user`, {
          params: {
            userId
          },
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).subscribe({
          next: val => {
            this.userData.set(parseServerMsg(val as string));
          },
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  getChildrenForParent(parentId: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/parent/${parentId}/children`, {
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).subscribe({
          next: val => {
            subscriber.next(parseServerMsg(val as string).results);
          },
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  addChildForParent(parentId: string, authCode: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.post(`${env.restUrlBase}/parent/${parentId}/children`, {
          authCode
        },{
          responseType: 'json',
          withCredentials: true
        }).subscribe({
          next: val => {
            subscriber.next(parseServerMsg(val as string).msg);
          },
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  getActiveStudents(firstName: string, lastName: string, displayId: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/students`, {
          params: {
            firstName,
            lastName,
            displayId
          },
          responseType: 'json',
          withCredentials: true
        }).subscribe({
          next: val => {
            subscriber.next(parseServerMsg(val as string).results);
          },
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }
}
