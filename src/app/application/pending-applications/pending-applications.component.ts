import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PendingApplications } from '../../types/pending-addpications';
import { PendingApplicationService } from '../../services/pending-application.service';
import parseServerMsg from '../../util/parseServerMsg';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-applications',
  imports: [],
  templateUrl: './pending-applications.component.html',
  styleUrl: './pending-applications.component.css'
})
export class PendingApplicationsComponent implements OnInit {
  pendingApplications: WritableSignal<PendingApplications | null> = signal(null);
  baseUrlForPicture: WritableSignal<string> = signal(`${env.restUrlBase}/file/`);

  constructor (
    private pendingAppService: PendingApplicationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  search(stFirstName: string ='', stLastName: string ='', studentDisplayId: string ='') {
    this.getPendingApps(stFirstName, stLastName, studentDisplayId);
  }

  viewApp(_id: string) {
    console.log('navigate to: ', _id);
    this.router.navigate([`/application/${_id}`]);
  }

  ngOnInit(): void {
    this.getPendingApps();
  }

  private getPendingApps(stFirstName: string ='', stLastName: string ='', studentDisplayId: string ='') {
    this.pendingAppService.getPendingApplications(stFirstName, stLastName, studentDisplayId)
      .subscribe({
        next: val => {
          const results: PendingApplications = parseServerMsg(val as string);
          this.pendingApplications.set(results);
        },
        error: err => {
          console.error(err);
          const msg = parseServerMsg(err.error).msg;
          this.showSnackBar(msg);
        },
        complete: () => {}
      });
  }

}
