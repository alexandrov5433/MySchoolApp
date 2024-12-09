import { Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../environments/environment.development';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-main',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css'
})
export class ProfileMainComponent implements OnInit, OnDestroy {
  private ngDestroyer = new Subject();

  userProfileData: WritableSignal<User | null> = signal(null);
  userIdForProfileData: WritableSignal<string> = signal('');
  viewerId: WritableSignal<string> = signal('');
  userOwnerOfProfileStatus: Signal<string> = computed(() => {
    const status = this.userProfileData()?.status;
    return status ? status : '';
  });
  userOwnerOfProfileIdTitle: Signal<string> = computed(() => {
    const status = this.userProfileData()?.status;
    return status ? status?.toUpperCase() : '';
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  private loadUserData() {
    this.userService.getUserData(this.userIdForProfileData())
      .subscribe({
        next: val => { },
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => {
          this.userProfileData.set(this.userService.user_data);
        }
      });
  }


  userPicSrc: Signal<string> = computed(() => {
    if (!this.userProfileData()) {
      return '';
    }
    const picId: string = this.userProfileData()?.profilePicture || '';
    return `${env.restUrlBase}/file/stream/${picId}`;
  });

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  ngOnInit(): void {
    this.viewerId.set(this.userService.user_Id);
    this.userIdForProfileData.set(this.route.snapshot.paramMap.get('_id') || '');
    this.loadUserData();
    this.route.params
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe({
        next: val => {
          this.userIdForProfileData.set(val['_id']),
          this.loadUserData();
        },
        error: err => console.error('observe params error', err),
        complete: () => {},
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
