import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../types/application';

@Injectable({
  providedIn: 'root'
})
export class InterElementCommunicationService {
    pendingApplicationData: WritableSignal<Application | null> = signal(null);

}