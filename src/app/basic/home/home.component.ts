import { Component, computed, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {
  isUserLoggedIn: Signal<boolean> = computed(() => {
    return this.userService.isUserLoggedIn;
  });
  userId: Signal<string> = computed(() => {
    return this.userService.user_Id;
  });
  constructor(
    private userService: UserService
  ) {}
}
