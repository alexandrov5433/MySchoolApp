import { Component, computed, Input, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { SubjectsService } from '../../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../../environments/environment.development';
import { Subject } from '../../../types/subject';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject as rxjsSubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-subject-details',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './subject-details.component.html',
  styleUrl: './subject-details.component.css',
  standalone: true
})
export class SubjectDetailsComponent implements OnInit, OnDestroy{
  private ngDestroyer = new rxjsSubject();
  subject: WritableSignal<Subject | null> = signal(null);
  subjectId: string = '';
  curUserStatus: WritableSignal<string> = signal('');
  curUserId: WritableSignal<string> = signal('');

  showFullNav: Signal<boolean> = computed(() => {
    //show full for teachers and participating students
    if (this.curUserStatus() === 'teacher') {
      return true;
    } else if (this.curUserStatus() === 'student') {
      const isParticipant = this.subject()?.participants.find(p => p._id === this.curUserId());
      return isParticipant ? true : false;
    }
    return false;
  });

  //for teacher
  teacherPicSrc: Signal<string> = computed(() => {
    if (!this.subject()) {
      return '';
    }
    const picId: string = this.subject()?.teacher.profilePicture || '';
    return `${env.restUrlBase}/file/stream/${picId}`;
  });
  teacherName: Signal<string> = computed(() => {
    if (!this.subject()) {
      return '';
    }
    const firstName = this.subject()?.teacher.firstName || '';
    const lastName = this.subject()?.teacher.lastName || '';
    return `${firstName} ${lastName}`;
  });

  //for student
  showParticipationBtns: WritableSignal<boolean> = signal(false);
  canJoin: WritableSignal<boolean> = signal(false);

  constructor(
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) { }

  checkMustDisplayParticipationBtns() {
    if (this.curUserStatus() === 'student') {
      const isParticipant = this.subject()?.participants.find(p => p._id === this.curUserId());
      this.canJoin.set(!Boolean(isParticipant));
      this.showParticipationBtns.set(true);   
    } else {
      this.showParticipationBtns.set(false);
    }
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  joinSubject() {
    this.subjectsService.participationControl(this.subjectId, this.curUserId(), 'join')
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => this.showSnackBar(err as string),
        complete: () => {
          this.loadData();
          this.subjectsService.realoadDataTriggerForChildren.next('trigger');
        }
      });
  }

  leaveSubject() {
    this.subjectsService.participationControl(this.subjectId, this.curUserId(), 'leave')
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => this.showSnackBar(err as string),
        complete: () => {
          this.loadData();
          this.subjectsService.realoadDataTriggerForChildren.next('trigger');
        }
      });
  }

  @Input()
  set _id(_id: string) {
    this.subjectId = _id;
  }

  navigateTo(path: string) {
    const url = `/subject-details/${this.subjectId}/${path}`;
    this.router.navigate([url]);
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
        this.checkMustDisplayParticipationBtns();
      }
    });
  }

  ngOnInit(): void {
    console.log(this.subjectId);
    if (
      !this.router.url.endsWith('participants') &&
      !this.router.url.endsWith('announcements') &&
      !this.router.url.endsWith('assignments') &&
      !this.router.url.endsWith('materials')
    ) {
      this.navigateTo('participants');
    }
    this.subjectsService.realoadDataTriggerForParent
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
