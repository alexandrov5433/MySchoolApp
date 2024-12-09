import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent implements OnInit{
  userId: Signal<string> = computed(() => {
    return this.userSevice.user_Id
  });

  constructor(
    private userSevice: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  get isUserLoggedIn(): boolean {
    return this.userSevice.isUserLoggedIn;
  }

  get userAuthorizationStatus(): string {
    return this.userSevice.userAuthStatus;
 
  }

  logout(): void {
    this.userSevice.logout()
      .subscribe({
        next: val => console.log(val),
        error: (err) => {
          console.error(err);
          this.showSnackBar(parseServerMsg(err.error).msg);
        },
        complete: () => {
          this.showSnackBar('Log out successfull!');
          this.router.navigate(['/home']);
        }
      });;
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  ngOnInit(): void {
    console.log('header userId', this.userId()); 
  }

}
