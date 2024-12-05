import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PendingApplicationService {

  constructor(private http: HttpClient) { }
/**
 * 
 * @param studentFirstName First name of student.
 * @param studentLastName Last name of student.
 * @param studentDisplayId Students (User) displayId in DB.
 * @returns 
 */
  getPendingApplications(studentFirstName: string='', studentLastName: string='', studentDisplayId: string=''):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/application/pending`, {
          params: {
            studentFirstName,
            studentLastName,
            studentDisplayId
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
 * Returns one specific pending application.
 * @param _id The _id of the Application document in the DB.
 */
  getApplicationById(_id: string) {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/application/single-pending-application/${_id}`, {
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