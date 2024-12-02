import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestComService {

  constructor(private http: HttpClient) { }

  register(formData: FormData): Observable<Object> {
    return this.http.post('http://loacalhost:3000/user', formData);
  }
  
}