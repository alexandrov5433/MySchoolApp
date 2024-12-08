import { Component, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../types/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent {
  userIdForProfileData: WritableSignal<string> = signal('');
  userProfileData: WritableSignal<User | null> = signal(null);

  // nameForm: FormGroup = new FormGroup({});
  // contactForm: FormGroup = new FormGroup({});
  // addressForm: FormGroup = new FormGroup({});


  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  private loadUserData() {
    this.userService.getUserData(this.userIdForProfileData())
      .subscribe({
        next: val => { },
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => {
          this.userProfileData.set(this.userService.user_data);
        }
      });
  }

  // nameFormEditingActive: WritableSignal<boolean> = signal(true);
  // contactFormEditingActive: WritableSignal<boolean> = signal(true);
  // addressFormEditingActive: WritableSignal<boolean> = signal(true);

  // private loadUserData() {
  //   this.userService.getUserData(this.userId())
  //     .subscribe({
  //       next: val => {
  //         // this.userData.set(val as User);
  //       },
  //       error: err => {
  //         console.error(err);
  //         this.showSnackBar(err);
  //       },
  //       complete: () => {
  //         this.nameForm = new FormGroup({
  //           firstName: new FormControl(this.userData()?.firstName),
  //           lastName: new FormControl(this.userData()?.lastName),
  //           dateOfBirth: new FormControl(this.userData()?.dateOfBirth),
  //         });
  //         this.contactForm = new FormGroup({
  //           mobileNumber: new FormControl(''),
  //           homeNumber: new FormControl(''),
  //           email: new FormControl(''),
  //         });
  //         this.addressForm = new FormGroup({
  //           street: new FormControl(''),
  //           houseNumber: new FormControl(''),
  //           city: new FormControl(''),
  //         });
  //         this.nameFormEditingActive.set(false);
  //         this.contactFormEditingActive.set(false);
  //         this.addressFormEditingActive.set(false);
  //       }
  //     });
  // }

  // editAndCancelNameForm(action: 'edit' | 'cancel') {

  //   if (action === 'edit') {
  //     this.nameFormEditingActive.set(true);
  //   } else {
  //     this.nameForm.reset();
  //     this.nameFormEditingActive.set(false);
  //   }
  // }
  // editAndCancelContactForm(action: 'edit' | 'cancel') {
  //   if (action === 'edit') {
  //     this.contactFormEditingActive.set(true);
  //   } else {
  //     this.contactFormEditingActive.set(false);
  //   }
  // }
  // editAndCancelAddressForm(action: 'edit' | 'cancel') {
  //   if (action === 'edit') {
  //     this.addressFormEditingActive.set(true);
  //   } else {
  //     this.addressFormEditingActive.set(false);
  //   }
  // }

  // submitNameForm() {

  // }
  // submitContactForm() {

  // }
  // submitAddressForm() {

  // }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  // currentUserStatus() {
  //   return this.userService.userAuthStatus;
  // }

  ngOnInit(): void {
    this.userIdForProfileData.set(this.route.snapshot.paramMap.get('_id') || '');
    this.loadUserData()
    // this.nameForm = new FormGroup({
    //   firstName: new FormControl(this.userData()?.firstName),
    //   lastName: new FormControl(this.userData()?.lastName),
    //   dateOfBirth: new FormControl(this.userData()?.dateOfBirth),
    // });
    // this.contactForm = new FormGroup({
    //   mobileNumber: new FormControl(''),
    //   homeNumber: new FormControl(''),
    //   email: new FormControl(''),
    // });
    // this.addressForm = new FormGroup({
    //   street: new FormControl(''),
    //   houseNumber: new FormControl(''),
    //   city: new FormControl(''),
    // });
    // this.nameFormEditingActive.set(false);
    // this.contactFormEditingActive.set(false);
    // this.addressFormEditingActive.set(false);
  }
}
