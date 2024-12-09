import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { User } from '../../types/user';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-students',
  imports: [RouterLink],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.css'
})
export class AllStudentsComponent implements OnInit {
  studentsData: WritableSignal<Array<User> | null> = signal(null);
  baseUrlForPicture: WritableSignal<string> = signal(`${env.restUrlBase}/file/stream/`);

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  search(firstName: string, lastName: string, displayId: string) {
    this.loadStudentsData(firstName.trim(), lastName.trim(), displayId.trim());
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private loadStudentsData(firstName: string = '', lastName: string = '', displayId: string = '') {
    this.userService.getActiveStudents(firstName, lastName, displayId)
      .subscribe({
        next: val => this.studentsData.set(val as Array<User>),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => { }
      });
  }

  ngOnInit(): void {
    this.loadStudentsData();
  }
}
