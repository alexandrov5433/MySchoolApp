import { Component, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { emailValidator } from '../../util/validators/email.validator';
import { lastNameValidator } from '../../util/validators/last-name.validator';
import { streetValidator } from '../../util/validators/street.validator';
import { houseNumberValidator } from '../../util/validators/house-number.validator';
import { mobileNumberValidator } from '../../util/validators/mobile-number.validator';
import { cityValidator } from '../../util/validators/city.validator';
import { ValidationLib } from '../../types/validationLib';
import { homeNumberValidator } from '../../util/validators/home-number.validator';
import { dateOfBirthValidator } from '../../util/validators/date-of-birth.validator';
import { firstNameValidator } from '../../util/validators/first-name.validator';
import { passwordValidator } from '../../util/validators/password.validator';
import { applyNowRePasswordValidator } from '../../util/validators/apply-now-re-password.validator';
import { documentsValidator } from '../../util/validators/documents.validator';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-apply-now',
  imports: [ReactiveFormsModule],
  templateUrl: './apply-now.component.html',
  styleUrl: './apply-now.component.css',
  standalone: true
})
export class ApplyNowComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    firstName: new FormControl('', [firstNameValidator()]),
    lastName: new FormControl('', [lastNameValidator()]),
    dateOfBirth: new FormControl('', [dateOfBirthValidator()]),
    email: new FormControl('', [emailValidator()]),
    mobileNumber: new FormControl('', [mobileNumberValidator()]),
    homeNumber: new FormControl('', [homeNumberValidator()]),
    street: new FormControl('', [streetValidator()]),
    houseNumber: new FormControl('', [houseNumberValidator()]),
    city: new FormControl('', [cityValidator()]),
    password: new FormControl('', [passwordValidator()]),
    applyNowRePassword: new FormControl('', [applyNowRePasswordValidator(this)]),
    profilePicture: new FormControl(''),
    documents: new FormControl('', [documentsValidator()]),
  });

  isLoading: Signal<boolean> = signal(false);

  profilePictureFileName: string | null = null;
  profilePictureFile: File | null = null;
  documentsFilesNames: Array<string> = [];
  documentsFiles: Array<File> = [];

  private ngUnsub = new Subject();

  validationLib: ValidationLib = {
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
    password: {
      validationClass: '',
      showErrMsg: false
    },
    applyNowRePassword: {
      validationClass: '',
      showErrMsg: false
    },
    profilePicture: {
      showErrMsg: false
    },
    documents: {
      validationClass: '',
      showErrMsg: false
    }
  };

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  apply() {
    console.log('Apply!');
    console.log(this.documentsFilesNames);
    console.log(this.documentsFiles);

  }

  isTouched(control: string): boolean | undefined {
    return this.form.get(control)?.touched;
  }

  isMissingValue(control: string): boolean | undefined {
    return this.form.get(control)?.value === '';
  }

  get isFormInvalid(): boolean {

    if (this.form.touched) {
      if (!this.form.get('applyNowRePassword')?.touched || !this.filesSelected()) {
        return true;
      }
      return this.form.invalid;
    }
    return true;
  }

  ngOnInit(): void {
    // form validation
    ['firstName',
      'lastName',
      'dateOfBirth',
      'email',
      'mobileNumber',
      'homeNumber',
      'street',
      'houseNumber',
      'city',
      'password',
      'applyNowRePassword',
      'documents'
    ].forEach(control => {
      this.form.get(control)?.valueChanges
        .pipe(takeUntil(this.ngUnsub))
        .subscribe(() => {
          const validatorName = control + 'Validator';
          if (this.form.get(control)?.errors?.[validatorName]) {
            (this.validationLib as any)[control].validationClass = 'false-input';
            (this.validationLib as any)[control].showErrMsg = true;
          } else {
            (this.validationLib as any)[control].validationClass = 'correct-input';
            (this.validationLib as any)[control].showErrMsg = false;
          }
        });
    });
  }

  onProfilePictureFileSelect(event: any) {
    if (!event.target.files[0]) {
      this.profilePictureFileName = null;
      this.profilePictureFile = null;
      event.target.value = '';
      return;
    }
    const fileType = event.target.files[0].type;
    if (!['image/jpeg', 'image/png'].includes(fileType)) {
      // display validation error
      this.validationLib.profilePicture.showErrMsg = true;
      //reset properties from old file selection if present
      this.profilePictureFileName = null;
      this.profilePictureFile = null;
      event.target.value = '';
      return
    }
    // hide  validation error, if on display
    this.validationLib.profilePicture.showErrMsg = false;
    this.profilePictureFileName = event.target.files[0]?.name;
    this.profilePictureFile = event.target.files[0];
    event.target.value = '';
  }

  onDocumentsFilesSelect(event: any) {
    if (!event.target.files[0]) {
      return;
    }
    for (let f of event.target.files) {  
      if (!f.name.endsWith('.pdf')) {
        continue;
      }
      this.documentsFilesNames.push(f.name);
      this.documentsFiles.push(f);
    }
    event.target.value = ''; // resetting after every file select so that the user can select the same file right after clearAllFiles and (in general)
  }

  clearPictureFile() {
    this.profilePictureFileName = null;
    this.profilePictureFile = null;
  }

  clearAllFiles() {
    this.documentsFilesNames = [];
    this.documentsFiles = [];
  }

  filesSelected() {
    return this.documentsFiles.length > 0;
  }

  ngOnDestroy(): void {
    this.ngUnsub.next(true);
    this.ngUnsub.complete();
  }
}
