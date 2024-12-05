import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { PendingApplicationService } from '../../services/pending-application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';
import { Application } from '../../types/application';
import { environment as env } from '../../../environments/environment.development';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-application-main',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './application-main.component.html',
  styleUrl: './application-main.component.css',
  standalone: true
})
export class ApplicationMainComponent implements OnInit {
  private appId: string = '';
  appData: WritableSignal<Application | null> = signal(null);
  applicantPicUrl: Signal<string> = computed(() => {
    const picId = this.appData()?.applicant.profilePicture || '';
    return `${env.restUrlBase}/file/${picId}`;
  });

  
  constructor(
    private pendingAppService: PendingApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  get applicantName():string {
    return (this.appData()?.applicant.firstName + ' ' + this.appData()?.applicant.lastName);
  }

  get appDisplayId():string {
    return this.appData()?.applicant.displayId || '';
  }
  
  get isTeacherViewing():boolean {
    if (this.userService.userAuthStatus === 'teacher') {
      return true;
    }
    return false;
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  @Input()
  set _id(_id: string) {
    this.appId = _id;
  }

  ngOnInit(): void {
    this.pendingAppService.getApplicationById(this.appId)
      .subscribe({
        next: val => {
          const result: Application = parseServerMsg(val as string);
          console.log(result);
          this.appData.set(result);
        },
        error: err => {
          console.error(err);
          const msg = parseServerMsg(err.error).msg;
          this.showSnackBar(msg);
        },
        complete: () => { }
      });
  }
}
