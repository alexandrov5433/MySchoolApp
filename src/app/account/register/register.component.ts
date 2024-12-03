import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { emailValidator } from '../../util/validators/email.validator';
import { lastNameValidator } from '../../util/validators/last-name.validator';
import { streetValidator } from '../../util/validators/street.validator';
import { houseNumberValidator } from '../../util/validators/house-number.validator';
import { mobileNumberValidator } from '../../util/validators/mobile-number.validator';
import { cityValidator } from '../../util/validators/city.validator';
import { ValidationLib } from '../../types/validationLib';
import { homeNumberValidator } from '../../util/validators/home-number.validator';
import { registerAsValidator } from '../../util/validators/register-as.validator';
import { dateOfBirthValidator } from '../../util/validators/date-of-birth.validator';
import { authenticationCodeValidator } from '../../util/validators/authentication-code.validator';
import { firstNameValidator } from '../../util/validators/first-name.validator';
import { passwordValidator } from '../../util/validators/password.validator';
import { rePasswordValidator } from '../../util/validators/re-password.validator';
import { UserService } from '../../services/user.service';
import parseServerMsg from '../../util/parseServerMsg';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoaderComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm = new FormGroup({
    registerAs: new FormControl('', [registerAsValidator()]),
    firstName: new FormControl('', [firstNameValidator()]),
    lastName: new FormControl('', [lastNameValidator()]),
    dateOfBirth: new FormControl('', [dateOfBirthValidator()]),
    email: new FormControl('', [emailValidator()]),
    mobileNumber: new FormControl('', [mobileNumberValidator()]),
    homeNumber: new FormControl('', [homeNumberValidator()]),
    street: new FormControl('', [streetValidator()]),
    houseNumber: new FormControl('', [houseNumberValidator()]),
    city: new FormControl('', [cityValidator()]),
    authenticationCode: new FormControl('', [authenticationCodeValidator()]),
    password: new FormControl('', [passwordValidator()]),
    rePassword: new FormControl('', [rePasswordValidator(this)]),
    profilePicture: new FormControl(''),
  });
  isLoading = false;
  profilePictureFileName: string | null = null;
  profilePictureFile: File | null = null;
  private ngUnsub = new Subject();
  validationLib: ValidationLib = {
    registerAs: {
      validationClass: '',
      showErrMsg: false
    },
    firstName: {
      validationClass: '',
      showErrMsg: false
    },
    lastName: {
      validationClass: '',
      showErrMsg: false
    },
    dateOfBirth: {
      validationClass: '',
      showErrMsg: false
    },
    email: {
      validationClass: '',
      showErrMsg: false
    },
    mobileNumber: {
      validationClass: '',
      showErrMsg: false
    },
    homeNumber: {
      validationClass: '',
      showErrMsg: false
    },
    street: {
      validationClass: '',
      showErrMsg: false
    },
    houseNumber: {
      validationClass: '',
      showErrMsg: false
    },
    city: {
      validationClass: '',
      showErrMsg: false
    },
    authenticationCode: {
      validationClass: '',
      showErrMsg: false
    },
    password: {
      validationClass: '',
      showErrMsg: false
    },
    rePassword: {
      validationClass: '',
      showErrMsg: false
    },
    profilePicture: {
      showErrMsg: false
    }
  };
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  register(): void {
    const status = this.registerForm.get('registerAs')?.value || '';
    const formData = new FormData();
    for (let ent of Object.entries(this.registerForm.value)) {
      const key:string = ent[0];
      const val:any = ent[1];
      formData.set(key, val);
    }
    console.log(Object.fromEntries(formData.entries()));
    if (this.profilePictureFile) {
      formData.set('profilePicture', this.profilePictureFile);
    }
    console.log(Object.fromEntries(formData.entries()));

    this.userService.register(formData, status)
      .subscribe({
        next: (val) => {
          console.log(val);
        },
        error: (err) => {
          console.error(parseServerMsg(err.error));
        },
        complete: () => {
          console.log('Done');
          this.router.navigate(['/home']);
        }
      });
  }

  isTouched(control: string): boolean | undefined {
    return this.registerForm.get(control)?.touched;
  }

  isMissingValue(control: string): boolean | undefined {
    return this.registerForm.get(control)?.value === '';
  }

  get isRegisterFormInvalid(): boolean {
    
    if (this.registerForm.touched) {
      if (!this.registerForm.get('rePassword')?.touched) {
        return true;
      }
      return this.registerForm.invalid;
    }
    return true;
  }

  ngOnInit(): void {
    // form validation
    ['registerAs',
      'firstName',
      'lastName',
      'dateOfBirth',
      'email',
      'mobileNumber',
      'homeNumber',
      'street',
      'houseNumber',
      'city',
      'authenticationCode',
      'password',
      'rePassword'].forEach(control => {
        this.registerForm.get(control)?.valueChanges
          .pipe(takeUntil(this.ngUnsub))
          .subscribe(x => {
            const validatorName = control + 'Validator';
            if (this.registerForm.get(control)?.errors?.[validatorName]) {
              (this.validationLib as any)[control].validationClass = 'false-input';
              (this.validationLib as any)[control].showErrMsg = true;
            } else {
              (this.validationLib as any)[control].validationClass = 'correct-input';
              (this.validationLib as any)[control].showErrMsg = false;
            }
          });
      });
  }

  // file input management for profile picture
  onFileSelect(event: any) {
    if (!event.target.files[0]) {
      this.profilePictureFileName = null;
      this.profilePictureFile = null;
      return;
    }
    const fileType = event.target.files[0].type;
    if (!['image/jpeg', 'image/png'].includes(fileType)) {
      // display validation error
      this.validationLib.profilePicture.showErrMsg = true;
      //reset properties from old file selection if present
      this.profilePictureFileName = null;
      this.profilePictureFile = null;
      return
    }
    // hide  validation error, if on display
    this.validationLib.profilePicture.showErrMsg = false;
    this.profilePictureFileName = event.target.files[0]?.name;
    this.profilePictureFile = event.target.files[0];
  }

  ngOnDestroy(): void {
    this.ngUnsub.next(true);
    this.ngUnsub.complete();
  }
}
