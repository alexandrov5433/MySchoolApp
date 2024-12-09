import { Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { GradeService } from '../../services/grade.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-grade-window',
  imports: [],
  templateUrl: './add-grade-window.component.html',
  styleUrl: './add-grade-window.component.css',
  standalone: true
})
export class AddGradeWindowComponent implements OnInit {
  @Input() gradingIdToAddGradeTo = '';
  @Input() userIdToAddGradeFor = '';
  @Output() gradeAdded = new EventEmitter<boolean>();
  @Output() gradeAdditionCanceled = new EventEmitter<boolean>();
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

  addGrade(grade: string) {
    if(!grade) {
      this.validationClass.set('false-input');
      this.showError.set(true);
      return;
    }
    this.validationClass.set('correct-input');
    this.showError.set(false);
    
    this.gradeService.addGradeInGrading(this.userIdToAddGradeFor, this.gradingIdToAddGradeTo, grade)
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => { 
          this.showSnackBar(err)
          this.cancel();
        },
        complete: () => {
          this.gradeAdded.emit(true);
        }
      });
  }

  cancel() {
    this.gradeAdditionCanceled.emit(true);
  }

  ngOnInit(): void {
  }

}
