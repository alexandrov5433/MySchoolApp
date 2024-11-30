import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {

  constructor(
    private userSevice: UserService,
    private router: Router
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
        complete: () => {
          console.log('Logout successfull!');
          this.router.navigate(['/home']);
        },
        error: (e) => {
          console.error(e);
        }
      });;
    this.router.navigate(['/home']);
  }
}
