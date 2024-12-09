import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { GradeService } from '../../services/grade.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-grade-window',
  imports: [],
  templateUrl: './edit-grade-window.component.html',
  styleUrl: './edit-grade-window.component.css',
  standalone: true
})
export class EditGradeWindowComponent {
  @Input() gradeIdToEdit = '';
  @Input() userIdToEditGradeFor = '';
  @Input() gradeToEdit = '';
  @Output() gradeEdited = new EventEmitter<boolean>();
  @Output() gradeEditingCanceled = new EventEmitter<boolean>();
  validationClass: WritableSignal<string> = signal('');
  showError: WritableSignal<boolean> = signal(false);

  constructor (
    private gradeService: GradeService,
    private snackBar: MatSnackBar
  ) {}

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  editGrade(grade: string) {
    if(!grade) {
      this.validationClass.set('false-input');
      this.showError.set(true);
      return;
    }
    this.validationClass.set('correct-input');
    this.showError.set(false);
    console.log('edited grade', grade);
    
    this.gradeService.editGrade(this.userIdToEditGradeFor, this.gradeIdToEdit, grade)
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => {
          this.showSnackBar(err);
          this.cancel();
        },
        complete: () => {
          this.gradeEdited.emit(true);
        }
      });
  }

  cancel() {
    this.gradeEditingCanceled.emit(true);
  }
}
