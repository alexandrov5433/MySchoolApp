import { Component, computed, Input, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject as rxjsSubject, takeUntil } from 'rxjs';
import { Subject } from '../../../types/subject';
import { SubjectsService } from '../../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { formatDateTime } from '../../../util/time';


@Component({
  selector: 'app-subject-announcements',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-announcements.component.html',
  styleUrl: './subject-announcements.component.css'
})
export class SubjectAnnouncementsComponent implements OnInit, OnDestroy {
  private ngDestroyer = new rxjsSubject();
  subject: WritableSignal<Subject | null> = signal(null);
  subjectId: string = '';
  curUserStatus: WritableSignal<string> = signal('');
  curUserId: WritableSignal<string> = signal('');

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  validationLib: any = {
    title: {
      validationClass: '',
      showErrMsg: false
    },
    description: {
      validationClass: '',
      showErrMsg: false
    }
  }
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

  publish() {
    this.validate('title');
    this.validate('description');
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('subjectId', this.subject()?._id || '');
    formData.append('teacher', this.curUserId());
    formData.append('title', (this.form.value as any).title);
    formData.append('description', (this.form.value as any).description);
    formData.append('dateTime', new Date().getTime().toString());
    this.subjectsService.publishAnnouncement(formData)
      .subscribe({
        next: val => {
          this.showSnackBar(val as string);
        },
        error: err => {
          this.showSnackBar(err as string);
        },
        complete: () => {
          this.loadData();
          this.form.reset();
          this.validationLib.title.validationClass = '';
        }
      });
  }

  delete(announId:string) {
    console.log(announId);
    this.subjectsService.removeAnnouncement(this.subjectId, announId)
    .subscribe({
      next: val => {
        this.showSnackBar(val as string);
      },
      error: err => {
        this.showSnackBar(err as string);
      },
      complete: () => {
        this.loadData();
      }
    });
  }

  //format datatime
  format(ms: string | number) {
    return formatDateTime(ms);
  }

  validate(control: string) {
    if (this.form.get(control)?.errors?.['required']) {
      (this.validationLib as any)[control].validationClass = 'false-input';
      (this.validationLib as any)[control].showErrMsg = true;
    } else {
      (this.validationLib as any)[control].validationClass = 'correct-input';
      (this.validationLib as any)[control].showErrMsg = false;
    }
  }

  showTeacherControls() {
    return this.curUserStatus() === 'teacher' ? true : false;
  }

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
