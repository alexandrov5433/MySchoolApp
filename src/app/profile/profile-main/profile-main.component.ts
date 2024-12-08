import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../environments/environment.development';

@Component({
  selector: 'app-profile-main',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css'
})
export class ProfileMainComponent implements OnInit {
  userProfileData: WritableSignal<User | null> = signal(null);
  userIdForProfileData: WritableSignal<string> = signal('');
  viewerId: WritableSignal<string> = signal('');

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
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
  // currentUserStatus() {
  //   return this.userService.userAuthStatus;
  // }

  ngOnInit(): void {
    this.viewerId.set(this.userService.user_Id);
    this.userIdForProfileData.set(this.userService.user_Id);
    this.loadUserData();
  }

}
