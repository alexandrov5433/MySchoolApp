import { Component, computed, Input, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { SubjectsService } from '../../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { Subject } from '../../../types/subject';
import { environment as env } from '../../../../environments/environment.development';
import { Subject as rxjsSubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subject-participants',
  imports: [],
  templateUrl: './subject-participants.component.html',
  styleUrl: './subject-participants.component.css'
})
export class SubjectParticipantsComponent implements OnInit, OnDestroy {
  private ngDestroyer = new rxjsSubject();
  subject: WritableSignal<Subject | null> = signal(null);
  subjectId: string = '';
  curUserStatus: WritableSignal<string> = signal('');
  curUserId: WritableSignal<string> = signal('');
  baseUrlForPicture: WritableSignal<string> = signal(`${env.restUrlBase}/file/stream/`);

  constructor(
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  isTeacherCreator: Signal<boolean> = computed(() => {
    if (this.subject()?.teacher._id == this.curUserId()) {
      return true;
    }
    return false;
  });

  @Input()
  set _id(_id: string) {
    this.subjectId = _id;
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private loadData() {
    this.subjectsService.getSubjectById(this.subjectId)
    .subscribe({
      next: val => { },
      error: err => {
        console.error(err);
        this.showSnackBar(err);
      },
      complete: () => {
        this.subject.set(this.subjectsService.subjectData());
        this.curUserStatus.set(this.userService.userAuthStatus);
        this.curUserId.set(this.userService.user_Id);
      }
    });
  }

  ngOnInit(): void {
    this.subjectsService.realoadDataTriggerForChildren
    .pipe(takeUntil(this.ngDestroyer))
    .subscribe({
      next: val => {
        this.loadData();
      }
    });
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
