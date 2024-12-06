import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PendingApplicationService } from '../../services/pending-application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from '../../types/application';
import { environment as env } from '../../../environments/environment.development';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-application-main',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './application-main.component.html',
  styleUrl: './application-main.component.css',
  standalone: true
})
export class ApplicationMainComponent implements OnInit {
  appId: string = '';
  appData: WritableSignal<Application | null> = signal(null);
  applicantPicUrl: Signal<string> = computed(() => {
    const picId = this.appData()?.applicant.profilePicture || '';
    return `${env.restUrlBase}/file/stream/${picId}`;
  });

  constructor(
    private pendingAppService: PendingApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) { }

  get applicantBackgrondPicPath(): string {
    return `/background/${this.appData()?.applicant.backgroundImageNumber}`;
  }

  get applicantName(): string {
    return (this.appData()?.applicant.firstName + ' ' + this.appData()?.applicant.lastName);
  }

  get appDisplayId(): string {
    return this.appData()?.applicant.displayId || '';
  }

  get isTeacherViewing(): boolean {
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

  navigateTo(path: string) {
    const url = `/application/${this.appId}/${path}`;
    this.router.navigate([url]);
  }

  acceptApp() {
    this.pendingAppService.manageApplication(this.appId, 'accept')
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => this.showSnackBar(err as string),
        complete: () => {
          this.router.navigate(['/home']);
        }
      });
  }

  rejectApp() {
    this.pendingAppService.manageApplication(this.appId, 'reject')
    .subscribe({
      next: val => this.showSnackBar(val as string),
      error: err => this.showSnackBar(err as string),
      complete: () => {
        this.router.navigate(['/home']);
      }
    });
  }

  @Input()
  set _id(_id: string) {
    this.appId = _id;
  }

  ngOnInit(): void {
    if (!this.router.url.endsWith('details') && !this.router.url.endsWith('documents')) {
      this.router.navigate([`/application/${this.appId}/details`]);
    }
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
