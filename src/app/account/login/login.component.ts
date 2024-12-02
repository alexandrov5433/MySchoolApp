import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsub = new Subject();
  isLoading: boolean = false;
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
  ) { }

  login() {
    const userLogsInAs = this.loginForm.get('loginAs')?.value;
    this.isLoading = true;
    this.userService.login(userLogsInAs)
      .subscribe({
        complete: () => {
          console.log('Login successfull!');
          this.router.navigate(['/home']);
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
        }
      });
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
