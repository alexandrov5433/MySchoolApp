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

  userId: WritableSignal<string> = signal('');
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
        next: () => {},
        error: (err) => {
          console.error(err);
          this.showSnackBar(parseServerMsg(err.error).msg);
        },
        complete: () => {
          this.showSnackBar('Log out successful!');
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
    //initial userId set, if any
    this.userId.set(this.userSevice.user_Id);
    //listening for userId changes and updating it on change. Mainly for the case of parents registering, to update the dropdown menu with the child.
    this.userSevice.userIdChangeEmitter
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe({
        next: val => {
          this.userId.set(val as string);
          if (this.userAuthStatus() === 'parent') {
            this.loadParentsChildren();
          }
        }
      });
    // user parent - listening for the event that he added a new child. In that case - children update in dropdown.
    this.innerComService.parentAddedChild
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe({
        next: val => this.loadParentsChildren()
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }

}
