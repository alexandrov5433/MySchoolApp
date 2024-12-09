import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InnerCommunicationService } from '../../services/inner-communication.service';

@Component({
  selector: 'app-add-child',
  imports: [],
  templateUrl: './add-child.component.html',
  styleUrl: './add-child.component.css',
  standalone: true
})
export class AddChildComponent {
  displayError: WritableSignal<boolean> = signal(false);
  validationClass: WritableSignal<string> = signal('');
  parentUserId: Signal<string> = computed(() => {
    return this.userService.user_Id;
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private innerComService: InnerCommunicationService
  ) { }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  addStudent(authCode: string) {
    console.log(authCode);
    if (!this.validate(authCode)) {
      return;
    }
    this.userService.addChildForParent(this.parentUserId(), authCode)
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => {
          this.innerComService.triggerParentAddedChild();
          this.router.navigate(['/home']);
        }
      });
  }

  validate(val: string): boolean {
    if (!val) {
      this.displayError.set(true);
      this.validationClass.set('false-input');
      return false;
    }
    this.displayError.set(false);
    this.validationClass.set('');
    return true;
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
