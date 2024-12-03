import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor(private http: HttpClient) { }


  createNewSubject(title: string):Observable<Object> {
    return new Observable((subscriber) => {
      try {
        this.http.post('http://localhost:3000/subjects/create-subject', JSON.stringify({title}), {
          responseType: 'json'
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