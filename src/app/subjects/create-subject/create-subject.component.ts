import { Component, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectsService } from '../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';

@Component({
  selector: 'app-create-subject',
  imports: [],
  templateUrl: './create-subject.component.html',
  styleUrl: './create-subject.component.css',
  standalone: true
})
export class CreateSubjectComponent {
  showError: WritableSignal<boolean> = signal(false);

  constructor(
    private router: Router,
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar
  ) { }

  onCreate(title: string) {
    title = title.trim();
    if (!title) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);
    let newSubjectId: string;
    this.subjectsService.createNewSubject(title)
      .subscribe({
        next: val => {
          newSubjectId = parseServerMsg(val as string).newSubjectId;
        },
        error: err => {
          this.showSnackBar(parseServerMsg(err.error).msg);
          console.error(err);
        },
        complete: () => {
          this.showSnackBar('Subject created!');
          this.router.navigate(['/home']);
          //TODO redirect to newly created subject
        }
      });
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
