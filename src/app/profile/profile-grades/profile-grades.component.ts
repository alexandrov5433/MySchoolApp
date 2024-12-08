import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AddGradeWindowComponent } from '../../shared/add-grade-window/add-grade-window.component';
import { GradeService } from '../../services/grade.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Grading } from '../../types/grading';

@Component({
  selector: 'app-profile-grades',
  imports: [AddGradeWindowComponent],
  templateUrl: './profile-grades.component.html',
  styleUrl: './profile-grades.component.css'
})
export class ProfileGradesComponent implements OnInit{
  mustOpenAddGradeWindow: WritableSignal<boolean> = signal(false);
  subjectIdForGradeAddition: WritableSignal<string> = signal('');

  userIdForGradesData: WritableSignal<string> = signal('');
  viewerId: WritableSignal<string> = signal('');
  viewerAuthStatus: WritableSignal<string> = signal('');

  gradingData: WritableSignal<Array<Grading> | null> = signal(null);

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

  addGradeTrigger() {




    this.mustOpenAddGradeWindow.set(true);
  }

  receiverGradeToAdd(grade: string) {
    console.log('receiverGradeToAdd', grade);

  }
  receiverGradeAdditionCanceled(trigger: boolean) {
    console.log('receiverGradeAdditionCanceled', trigger);
    this.mustOpenAddGradeWindow.set(false);

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
        complete: () => {
          console.log('gradingData:', this.gradingData());
          
        }
      });
  }

  ngOnInit(): void {
    this.viewerId.set(this.userService.user_Id);
    this.userIdForGradesData.set(this.route.snapshot.paramMap.get('_id') || '');
    this.viewerAuthStatus.set(this.userService.userAuthStatus);
    this.loadGradingData();
    
  }
}
