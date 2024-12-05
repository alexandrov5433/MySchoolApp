import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { SubjectDetails } from '../../../types/subjectDetails';
import { SubjectsService } from '../../../services/subjects.service';
import parseServerMsg from '../../../util/parseServerMsg';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '../../../../environments/environment.development';

@Component({
  selector: 'app-subject-details',
  imports: [],
  templateUrl: './subject-details.component.html',
  styleUrl: './subject-details.component.css',
  standalone: true
})
export class SubjectDetailsComponent implements OnInit {
  subjectDetails: WritableSignal<SubjectDetails | null> = signal(null);
  subjectId: string = '';
  teacherPicSrc: Signal<string> = computed(() => {
    const picId: string = this.subjectDetails()?.subject.teacherPictureId || '';
    return `${env.restUrlBase}/file/${picId}`;
  });

  constructor(
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar
  ) { }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  @Input()
  set _id(_id: string) {
    this.subjectId = _id;
  }

  ngOnInit(): void {
    console.log('_id recieved: ', this.subjectId);
    this.subjectsService.getSubjectById(this.subjectId)
      .subscribe({
        next: val => {
          const subjectResult: SubjectDetails = parseServerMsg(val as string);
          console.log(subjectResult);
          this.subjectDetails.set(subjectResult);
        },
        error: err => {
          console.error(err);
          const msg = parseServerMsg(err.error).msg;
          this.showSnackBar(msg);
        },
        complete: () => { }
      });
  }

  private getTeacherPicture(_id: string) {

  }

}
