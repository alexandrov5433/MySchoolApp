import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment.development';
import { Application } from '../types/application';
import parseServerMsg from '../util/parseServerMsg';

@Injectable({
  providedIn: 'root'
})
export class PendingApplicationService {

  pendingApplicationData: WritableSignal<Application | null> = signal(null);

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
          next: val => {
            const result: Application = parseServerMsg(val as string);
            this.pendingApplicationData.set(result);
          },
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

  /**
   * Sends a request to the server to either accept the applicant and make him a student or to decline the application.
   * @param _id The _id of the Application.
   * @param action The action to take.
   */
  manageApplication(_id: string, action: 'accept' | 'reject') {
    return new Observable((subscriber) => {
      try {
        this.http.post(`${env.restUrlBase}/application/manage`, { _id, action }, {
          responseType: 'json',
          withCredentials: true,
        }).subscribe({
          next: val => subscriber.next(parseServerMsg(val as string).msg),
          error: err => subscriber.error(parseServerMsg(err.error).msg),
          complete: () => subscriber.complete()
        });
      } catch (e) {
        subscriber.error(e);
      }
    });
  }

}