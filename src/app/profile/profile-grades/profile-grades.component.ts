import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { AddGradeWindowComponent } from '../add-grade-window/add-grade-window.component';
import { GradeService } from '../../services/grade.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Grading } from '../../types/grading';
import { EditGradeWindowComponent } from '../edit-grade-window/edit-grade-window.component';

@Component({
  selector: 'app-profile-grades',
  imports: [AddGradeWindowComponent, EditGradeWindowComponent],
  templateUrl: './profile-grades.component.html',
  styleUrl: './profile-grades.component.css'
})
export class ProfileGradesComponent implements OnInit {
  subjectIdForGradeAddition: WritableSignal<string> = signal('');

  userIdForGradesData: WritableSignal<string> = signal('');
  viewerId: Signal<string> = computed(() => {
    return this.userService.user_Id;
  });
  viewerAuthStatus: Signal<string> = computed(() => {
    return this.userService.userAuthStatus;
  });

  gradingData: WritableSignal<Array<Grading> | null> = signal(null);

  gradingId: WritableSignal<string> = signal('');
  mustOpenAddGradeWindow: WritableSignal<boolean> = signal(false);
  mustOpenGradeEditingWindow: WritableSignal<boolean> = signal(false);
  gradeToEdit: WritableSignal<string> = signal('');
  gradeIdToEdit: WritableSignal<string> = signal('');

  constructor(
    private gradeSevice: GradeService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  addGradeTrigger(gradingId: string) {
    this.gradingId.set(gradingId);
    this.mustOpenAddGradeWindow.set(true);
  }
  receiverGradeAdded(grade: boolean) {
    this.mustOpenAddGradeWindow.set(false);
    this.loadGradingData();
  }
  receiverGradeAdditionCanceled(trigger: boolean) {
    this.mustOpenAddGradeWindow.set(false);
  }

  editGradeTrigger(gradeId: string, grade: string) {
    this.gradeIdToEdit.set(gradeId);
    this.gradeToEdit.set(grade);
    this.mustOpenGradeEditingWindow.set(true);
  }
  receiverGradeEdited(grade: boolean) {
    this.mustOpenGradeEditingWindow.set(false);
    this.loadGradingData();
  }
  receiverGradeEditingCanceled(trigger: boolean) {
    this.mustOpenGradeEditingWindow.set(false);
  }

  deleteGradeTrigger(gradingId: string, gradeId: string) {
    this.gradeSevice.deleteGrade(this.userIdForGradesData(), gradeId, gradingId)
    .subscribe({
      next: val => this.showSnackBar(val as string),
      error: err => {
        this.showSnackBar(err);
      },
      complete: () => {
        this.loadGradingData();
      }
    });
  }


  private loadGradingData() {
    this.gradeSevice.getGradingsForUser(this.userIdForGradesData())
      .subscribe({
        next: val => {
          this.gradingData.set(val as Array<Grading>);
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => { console.log(this.gradingData());
        }
      });
  }

  ngOnInit(): void {
    this.userIdForGradesData.set(this.route.snapshot.paramMap.get('_id') || '');
    this.loadGradingData();
  }
}
