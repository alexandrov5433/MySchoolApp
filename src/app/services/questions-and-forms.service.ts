import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment.development';
import parseServerMsg from '../util/parseServerMsg';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuestionsAndFormsService {

    constructor(
        private http: HttpClient
    ) { }

    publishFaqEntry(formData: FormData): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.post(`${env.restUrlBase}/faq`, formData, {
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
    getFaqData(): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.get(`${env.restUrlBase}/faq`, {
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
    deleteFaqEntry(entryId: string): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.delete(`${env.restUrlBase}/faq/${entryId}`, {
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




    publishForm(formData: FormData): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.post(`${env.restUrlBase}/form`, formData, {
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
    getFormsData(): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.get(`${env.restUrlBase}/form`, {
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
    deleteForm(formId: string): Observable<Object> {
        return new Observable((subscriber) => {
            try {
                this.http.delete(`${env.restUrlBase}/form/${formId}`, {
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
}