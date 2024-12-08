import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
  userId: WritableSignal<string> = signal('');

  constructor(
    private userSevice: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  get isUserLoggedIn(): boolean {
    return this.userSevice.isUserLoggedIn;
  }

  get userAuthorizationStatus(): string | undefined {
    const status = this.userSevice.userAuthStatus;
    if (!status) {
      console.error(`HeaderComponent: Status is not of type string or is an empty string. Status: "${status}"`);
      return;
    }
    return status;
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
    this.userId.set(this.userSevice.user_Id);
  }

}
