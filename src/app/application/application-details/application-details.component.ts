import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { PendingApplicationService } from '../../services/pending-application.service';
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
    private pendingAppService: PendingApplicationService
  ) {}

  @Input()
  set _id(_id: string) {
    this.appId = _id;
  }

  ngOnInit(): void {
    this.pendingAppService.getApplicationById(this.appId)
    .subscribe({
      next: val => { },
      error: err => console.error(err),
      complete: () => {
        this.appData.set(this.pendingAppService.pendingApplicationData());
      }
    });
  }
}
