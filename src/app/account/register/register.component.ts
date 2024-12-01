import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { emailValidator } from '../../util/validators/email.validator';
import { lastNameValidator } from '../../util/validators/last-name.validator';
import { streetValidator } from '../../util/validators/street.validator';
import { houseNumberValidator } from '../../util/validators/house-number.validator';
import { mobileNumberValidator } from '../../util/validators/mobile-number.validator';
import { cityValidator } from '../../util/validators/city.validator';
import { validationLib } from '../../types/validationLib';
import { homeNumberValidator } from '../../util/validators/home-number.validator';
import { registerAsValidator } from '../../util/validators/register-as.validator';
import { dateOfBirthValidator } from '../../util/validators/date-of-birth.validator';
import { authenticationCodeValidator } from '../../util/validators/authentication-code.validator';
import { firstNameValidator } from '../../util/validators/first-name.validator';

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
    profilePicture: new FormControl(''),
  });
  isLoading = false;
  profilePictureFileName: string | null = null;
  profilePictureFile: File | null = null;
  private ngUnsub = new Subject();
  validationLib: validationLib = {
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
    profilePicture: {
      showErrMsg: false
    }
  };
  constructor() { }

  register(): void {
    console.log(this.registerForm);
  }

  isTouched(control: string): boolean | undefined {
    return this.registerForm.get(control)?.touched;
  }

  isMissingValue(control: string): boolean | undefined {
    return this.registerForm.get(control)?.value === '';
  }

  get isRegisterFormInvalid(): boolean {
    if (this.registerForm.touched) {
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
      'authenticationCode'].forEach(control => {
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
    if(!event.target.files[0]) {
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
