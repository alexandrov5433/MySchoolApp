import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';
import parseServerMsg from '../util/parseServerMsg';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient
  ) { }


  getUserDocuments(userId: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/profile/user/${userId}/documents`, {
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

  uploadDocument(userId: string, formData: FormData):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.post(`${env.restUrlBase}/profile/user/${userId}/documents`, formData, {
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

  deleteDocument(fileId: string, userId: string): Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.delete(`${env.restUrlBase}/profile/user/${userId}/documents/${fileId}`, {
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
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
}
