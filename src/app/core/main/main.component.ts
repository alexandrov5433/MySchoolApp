import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true
})
export class MainComponent implements OnInit {
  constructor (
    private cookieService: CookieService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userCookieExists = this.cookieService.get('user') ? true : false;
    this.userService.setPropsFromLocalStorageIfCookieExists(userCookieExists);
  } 
}
