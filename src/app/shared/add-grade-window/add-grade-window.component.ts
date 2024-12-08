import { Component, EventEmitter, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { GradeService } from '../../services/grade.service';

@Component({
  selector: 'app-add-grade-window',
  imports: [],
  templateUrl: './add-grade-window.component.html',
  styleUrl: './add-grade-window.component.css',
  standalone: true
})
export class AddGradeWindowComponent implements OnInit {
  @Input() subjectId = '';
  @Output() gradeToAdd = new EventEmitter<string>();
  @Output() gradeAdditionCanceled = new EventEmitter<boolean>();
  validationClass: WritableSignal<string> = signal('');
  showError: WritableSignal<boolean> = signal(false);

  constructor (
    private gradeService: GradeService
  ) {}


  addGrade(grade: string) {
    if(!grade) {
      this.validationClass.set('false-input');
      this.showError.set(true);
      return;
    }
    console.log('grade', grade);
    
    this.validationClass.set('correct-input');
    this.showError.set(false);
    this.gradeToAdd.emit(grade);
    this.gradeAdditionCanceled.emit(true);
  }

  cancel() {
    this.gradeAdditionCanceled.emit(true);
  }

  ngOnInit(): void {
    console.log('add-grade-component, subjectId: ', this.subjectId);
    
  }

}
