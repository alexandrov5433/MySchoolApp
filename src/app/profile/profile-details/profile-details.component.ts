import { Component, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent {
  userIdForProfileData: WritableSignal<string> = signal('');
  userProfileData: WritableSignal<User | null> = signal(null);

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

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  ngOnInit(): void {
    this.userIdForProfileData.set(this.route.snapshot.paramMap.get('_id') || '');
    console.log('userIdForProfileData: ', this.userIdForProfileData());
    
    this.loadUserData()
  }
}
