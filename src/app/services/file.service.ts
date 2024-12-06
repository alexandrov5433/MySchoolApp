import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment as env } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  constructor(private http: HttpClient) { }

  /**
   * Returns one specific subject.
   * @param _id The _id of the Subject document in the DB.
   */
  getFileStreamById(_id: string) {
    return new Observable((subscriber) => {
      try {
        this.http.get(`${env.restUrlBase}/file/stream/${_id}`, {
          responseType: 'blob',
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

  getFileDownloadById(_id: string) {
    // return new Observable((subscriber) => {
    //   try {
    //     this.http.get(`${env.restUrlBase}/file/download/${_id}`, {
    //       responseType: 'blob',
    //       withCredentials: true,
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       }
    //     }).subscribe({
    //       next: (data: any) => {
    //         this.blob = new Blob([data], {type: 'application/pdf'});

    //         const downloadURL = window.URL.createObjectURL(data);
    //         const link = document.createElement('a');
    //         link.href = downloadURL;
    //         link.download = "help.pdf";
    //         link.click();
    //       },
    //       error: err => subscriber.error(err),
    //       complete: () => subscriber.complete()
    //     });
    //   } catch (e) {
    //     subscriber.error(e);
    //   }
    // });
    try {
      return this.http.get(`${env.restUrlBase}/file/download/${_id}`, {
        responseType: 'blob',
        withCredentials: true,
        observe: 'body',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (e) {
      return throwError(() => e);
    }
  }

}