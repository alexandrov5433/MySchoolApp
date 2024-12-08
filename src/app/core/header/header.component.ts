import { Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';
import { User } from '../../types/user';
import { InnerCommunicationService } from '../../services/inner-communication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngDestroyer = new Subject();

  userId: Signal<string> = computed(() => {
    return this.userSevice.user_Id;
  });
  userAuthStatus: Signal<string> = computed(() => {
    return this.userSevice.userAuthStatus;
  });

  parentChildren: WritableSignal<Array<User> | null> = signal(null);

  constructor(
    private userSevice: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private innerComService: InnerCommunicationService
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

  private loadParentsChildren() {
    this.userSevice.getChildrenForParent(this.userId())
      .subscribe({
        next: val => this.parentChildren.set(val as Array<User>),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => { }
      });
  }

  ngOnInit(): void {
    console.log('header userId', this.userId());
    if (this.userAuthStatus() === 'parent') {
      this.loadParentsChildren();

      this.innerComService.parentAddedChild
        .pipe(takeUntil(this.ngDestroyer))
        .subscribe({
          next: val => this.loadParentsChildren()
        });
    }
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }

}
