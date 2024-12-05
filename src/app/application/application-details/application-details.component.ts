import { Component, Input, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { PendingApplicationService } from '../../services/pending-application.service';
import { InterElementCommunicationService } from '../../services/inter-element-communication.service';
import { Application } from '../../types/application';

@Component({
  selector: 'app-application-details',
  imports: [],
  templateUrl: './application-details.component.html',
  styleUrl: './application-details.component.css',
  standalone: true
})
export class ApplicationDetailsComponent implements OnInit {
  private appId: string = '';
  appData: WritableSignal<Application | null> = signal(null);

  constructor (
    private iec: InterElementCommunicationService
  ) {}

  @Input()
  set _id(_id: string) {
    this.appId = _id;
  }

  ngOnInit(): void {
    this.appData.set(this.iec.pendingApplicationData());
    console.log('app-details-cmp. _id: ', this.appData()?._id);
  }
}
