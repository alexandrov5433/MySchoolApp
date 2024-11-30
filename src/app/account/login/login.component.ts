import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
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

  constructor() {
    console.log(this.loginForm.get('loginAs'));
    
    this.loginForm.get('loginAs')?.valueChanges.subscribe(x => {
      console.log(x);
        if (this.isMissingValue('loginAs')) {
          this.loginAsInfo.validationClass = 'false-input';
          this.loginAsInfo.showErrMsg = true;
        } else {
          this.loginAsInfo.validationClass = 'correct-input';
          this.loginAsInfo.showErrMsg = false;
        }
    });
    this.loginForm.get('email')?.valueChanges.subscribe(x => {
      console.log(x);
        if (this.isMissingValue('email')) {
          this.emailInfo.validationClass = 'false-input';
          this.emailInfo.showErrMsg = true;
        } else {
          this.emailInfo.validationClass = 'correct-input';
          this.emailInfo.showErrMsg = false;
        }
    });
    this.loginForm.get('password')?.valueChanges.subscribe(x => {
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
// [class]="isTouched('loginAs') ? (isMissingValue('loginAs') ? 'false-input' : 'correct-input') : ''"
  login() {
    console.log(this.loginForm.valid); 
  }

  isTouched(control: string): boolean | undefined {
    return this.loginForm.get(control)?.touched;
  }

  isMissingValue(control: string): boolean | undefined {
    return this.loginForm.get(control)?.errors?.['required'];
  }

  get isLoginFormInvalid(): boolean {
    if(this.loginForm.touched) {
      return this.loginForm.invalid;
    }
    return true;
  }
}
