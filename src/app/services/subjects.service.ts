import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, model, ModelSignal, signal, WritableSignal } from '@angular/core';
import { Observable, Subject as rxjsSubject } from 'rxjs';
import { environment as env } from '../../environments/environment.development';
import { Subject } from '../types/subject';
import parseServerMsg from '../util/parseServerMsg';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  subjectData: WritableSignal<Subject | null> = signal(null);
  realoadDataTriggerForChildren = new rxjsSubject<any>();
  realoadDataTriggerForParent = new rxjsSubject<any>();

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
          next: val => {
            this.subjectData.set(parseServerMsg(val as string));
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
   * Adds or removes participant to/from subject.
   * @param subjectId The _id of the Subject document.
   * @param userId The _id of the student User.
   * @param action To join or leave the subject.
   */
  participationControl(subjectId: string, userId: string, action: 'join' | 'leave') {
    return new Observable((subscriber) => {
      try {
        this.http.post(`${env.restUrlBase}/subjects/participants/manage`, { subjectId, userId, action }, {
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