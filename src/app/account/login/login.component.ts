import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsub = new Subject();
  loginForm = new FormGroup({
    loginAs: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  loginAsInfo = {
    validationClass: '',
    showErrMsg: false
  };
  emailInfo = {
    validationClass: '',
    showErrMsg: false
  };
  passwordInfo = {
    validationClass: '',
    showErrMsg: false
  };

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login() {
    const userLogsInAs = this.loginForm.get('loginAs')?.value;
    console.log('Logging in...');
    this.userService.loginAs(userLogsInAs);
    this.router.navigate(['/home']);
  }

  isTouched(control: string): boolean | undefined {
    return this.loginForm.get(control)?.touched;
  }

  isMissingValue(control: string): boolean | undefined {
    return this.loginForm.get(control)?.errors?.['required'];
  }

  get isLoginFormInvalid(): boolean {
    if (this.loginForm.touched) {
      return this.loginForm.invalid;
    }
    return true;
  }

  ngOnInit(): void {
    // loginAs error messaging
    this.loginForm.get('loginAs')?.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(x => {
        console.log(x);
        if (this.isMissingValue('loginAs')) {
          this.loginAsInfo.validationClass = 'false-input';
          this.loginAsInfo.showErrMsg = true;
        } else {
          this.loginAsInfo.validationClass = 'correct-input';
          this.loginAsInfo.showErrMsg = false;
        }
      });
    // email error messaging
    this.loginForm.get('email')?.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(x => {
        console.log(x);
        if (this.isMissingValue('email')) {
          this.emailInfo.validationClass = 'false-input';
          this.emailInfo.showErrMsg = true;
        } else {
          this.emailInfo.validationClass = 'correct-input';
          this.emailInfo.showErrMsg = false;
        }
      });
    // password error messaging
    this.loginForm.get('password')?.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(x => {
        console.log(x);
        if (this.isMissingValue('password')) {
          this.passwordInfo.validationClass = 'false-input';
          this.passwordInfo.showErrMsg = true;
        } else {
          this.passwordInfo.validationClass = 'correct-input';
          this.passwordInfo.showErrMsg = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsub.next(true);
    this.ngUnsub.complete();
  }
}
