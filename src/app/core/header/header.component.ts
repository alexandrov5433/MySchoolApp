import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  get userAuthorizationStatus(): string {
    //TODO create service for account management and status fetching
    //expample return val lib
    const auth = {
      0: 'guest',
      1: 'student',
      2: 'parent',
      3: 'teacher',
    };
    return auth[0];
  }
}
