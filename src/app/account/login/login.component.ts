import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LoginValidationLib } from '../../types/loginValidationLib';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsub = new Subject();
  isLoading: WritableSignal<boolean> = signal(false);

  form = new FormGroup({
    loginAs: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  validationLib: LoginValidationLib = {
    loginAs: {
      validationClass: '',
      showErrMsg: false
    },
    email: {
      validationClass: '',
      showErrMsg: false
    },
    password: {
      validationClass: '',
      showErrMsg: false
    }
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  showSnackBar(msg: string) {
      this.snackBar.open(msg, 'OK', {
        duration: 7000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
  }

  login() {
    this.isLoading.set(true);
    const formData = new FormData();
    for (let ent of Object.entries(this.form.value)) {
      const key: string = ent[0];
      const val: any = ent[1];
      formData.set(key, val);
    }
    const stutus = this.form.get('loginAs')?.value || '';
    this.userService.login(formData, stutus)
      .subscribe({
        next: (val) => {
          console.log(val)
        },
        error: (err) => {
          this.isLoading.set(false);
          this.showSnackBar(parseServerMsg(err.error).msg);
          console.error(err);
        },
        complete: () => {
          this.isLoading.set(false);
          this.router.navigate(['/home']);
          this.showSnackBar('Login successful!');
        },
      });
  }

  get isLoginFormInvalid(): boolean {
    if (this.form.touched) {
      return this.form.invalid;
    }
    return true;
  }

  ngOnInit(): void {
    // form validation
    ['loginAs',
      'email',
      'password',
    ].forEach(control => {
      this.form.get(control)?.valueChanges
        .pipe(takeUntil(this.ngUnsub))
        .subscribe(() => {
          if (this.form.get(control)?.errors?.['required']) {
            (this.validationLib as any)[control].validationClass = 'false-input';
            (this.validationLib as any)[control].showErrMsg = true;
          } else {
            (this.validationLib as any)[control].validationClass = 'correct-input';
            (this.validationLib as any)[control].showErrMsg = false;
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsub.next(true);
    this.ngUnsub.complete();
  }
}
