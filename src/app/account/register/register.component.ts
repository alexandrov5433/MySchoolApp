import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoaderComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm = new FormGroup({
    registerAs: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dateOfBirth: new FormControl(''),
    email: new FormControl(''),
    mobileNumber: new FormControl(''),
    homeNumber: new FormControl(''),
    street: new FormControl(''),
    houseNumber: new FormControl(''),
    city: new FormControl(''),
    authenticationCode: new FormControl(''),
    profilePicture: new FormControl(''),
  });
  isLoading = false;
  constructor() {}

  register():void {
    console.log(this.registerForm);
    
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
