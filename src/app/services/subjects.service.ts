import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor(private http: HttpClient) { }


  createNewSubject(title: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.post(`${env.restUrlBase}/subjects/create-new-subject`, JSON.stringify({title}), {
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
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

  getSubjects(title: string='', subjectDisplayId: string='', mySubjectsOnly: boolean=false):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/subjects`, {
          params: {
            title,
            subjectDisplayId,
            mySubjectsOnly
          },
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
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
/**
 * Returns one specific subject.
 * @param _id The _id of the Subject document in the DB.
 */
  getSubjectById(_id: string) {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/subjects/details/${_id}`, {
          responseType: 'json',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
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