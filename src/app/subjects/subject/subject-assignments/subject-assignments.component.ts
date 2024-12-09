import { Component, computed, Input, signal, Signal, WritableSignal } from '@angular/core';
import { takeUntil, Subject as rxjsSubject } from 'rxjs';
import { formatDateTime } from '../../../util/time';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubjectsService } from '../../../services/subjects.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from '../../../types/subject';
import { FileService } from '../../../services/file.service';
import { mimeTypeLib } from '../../../util/mimeTypeLib';

@Component({
  selector: 'app-subject-assignments',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-assignments.component.html',
  styleUrl: './subject-assignments.component.css'
})
export class SubjectAssignmentsComponent {
  private ngDestroyer = new rxjsSubject();
  subject: WritableSignal<Subject | null> = signal(null);
  subjectId: string = '';
  curUserStatus: WritableSignal<string> = signal('');
  curUserId: WritableSignal<string> = signal('');

  resourceFileName: WritableSignal<string> = signal('');
  resourceFile: File | null = null;
  blob: any = '';
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    deadline: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  validationLib: any = {
    title: {
      validationClass: '',
      showErrMsg: false
    },
    deadline: {
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
    private userService: UserService,
    private fileService: FileService
  ) { }

  createAssignment() {
    this.validate('title');
    this.validate('deadline');
    this.validate('description');
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append('subjectId', this.subject()?._id || '');
    formData.append('teacher', this.curUserId());
    formData.append('title', (this.form.value as any).title);
    formData.append('description', (this.form.value as any).description);
    const deadlineDateTime = (new Date((this.form.value as any).deadline).getTime()).toString();
    formData.append('deadline', deadlineDateTime);
    if (this.resourceFile) {
      formData.append('resource', this.resourceFile);
    }
    this.onClearAllFields();
    this.subjectsService.createAssignment(formData)
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

  submitSolution(inputElemAndAssignmentId: string) {
    if (this.deadlinePassed(inputElemAndAssignmentId)) {
      this.showSnackBar(`Sorry, the deadline has already passed.`);
      this.loadData();
      return;
    }
    const elem: any = document.getElementById(inputElemAndAssignmentId);
    const file = elem.files[0];
    const solutionFileNameContainer: any = document.getElementById(`solutionFileName${inputElemAndAssignmentId}`);
    if (!file) {
      solutionFileNameContainer.textContent = 'No file chosen.';
      elem.value = '';
      return;
    }
    solutionFileNameContainer.textContent = 'No file chosen.';
    elem.value = '';

    const formData = new FormData();
    formData.append('assignmentId', inputElemAndAssignmentId);
    formData.append('studentId', this.curUserId());
    formData.append('solution', file);
    this.subjectsService.uploadSolution(formData)
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

  updateSolutionFileName(event: any, inputElemAndAssignmentId: string) {
    const elem: any = document.getElementById(inputElemAndAssignmentId);
    const file = elem.files[0];
    const solutionFileNameContainer: any = document.getElementById(`solutionFileName${inputElemAndAssignmentId}`);
    if (!file) {
      solutionFileNameContainer.textContent = 'No file chosen.';
      return;
    }
    solutionFileNameContainer.textContent = file.name;
  }

  onResourceFileSelect(event: any) {
    this.resourceFileName.set(event.target.files[0]?.name);
    this.resourceFile = event.target.files[0];
    event.target.value = '';
  }

  onClearFile() {
    this.resourceFileName.set('');
    this.resourceFile = null;
  }

  onClearAllFields() {
    this.onClearFile();
    this.form.reset();
    Object.keys(this.validationLib).forEach(k => {
      this.validationLib[k].validationClass = '';
      this.validationLib[k].showErrMsg = false;
    });
  }

  openStudentProfile(studentId: string) {
    console.log('Open studetn Profile: ', studentId);

  }

  downloadSolution(solutionId: string | undefined) {
    if (solutionId == undefined) {
      const msg = `Can not download a solution with an undefined id. ID: "${solutionId}".`;
      console.error(msg);
      this.showSnackBar(msg);
      return;
    }
    this.fileService.getFileStreamById(solutionId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          let extention = null;
          for (let [k,v] of Object.entries(mimeTypeLib)) {
            if (v == data.type) {
              extention = k;
              break;
            }
          }
          this.blob = new Blob([data], { type: data.type });
          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `solution.${extention ? extention : 'unknown'}`;
          link.click();
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err as string);
        },
        complete: () => { }
      });
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

  isTeacherCreator: Signal<boolean> = computed(() => {
    if (this.subject()?.teacher._id == this.curUserId()) {
      return true;
    }
    return false;
  });

  isParticipantViewing: Signal<boolean> = computed(() => {
    if (this.subject()?.participants.find(p => p._id == this.curUserId())) {
      return true;
    }
    return false;
  });

  format(ms: string | number) {
    return formatDateTime(ms);
  }

  downloadFile(fileId: string | undefined) {
    if (fileId == undefined) {
      const msg = `Can not download a solution with an undefined id. ID: "${fileId}".`;
      console.error(msg);
      this.showSnackBar(msg);
      return;
    }
    this.fileService.getFileStreamById(fileId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          let extention = null;
          for (let [k,v] of Object.entries(mimeTypeLib)) {
            if (v == data.type) {
              extention = k;
              break;
            }
          }
          this.blob = new Blob([data], { type: data.type });
          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `resource.${extention ? extention : 'unknown'}`;
          link.click();
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err as string);
        },
        complete: () => { }
      });
  }

  @Input()
  set _id(_id: string) {
    this.subjectId = _id;
  }

  getSolutionData(assignmentId: string): { fileName: string, fileId: string } | null {
    if (this.curUserStatus() === 'student') {
      const assignment = this.subject()?.assignments.find(e => e._id == assignmentId);
      const submition = assignment?.assignmentSubmitions?.find(e => e.student._id == this.curUserId());
      const solutionFile = submition?.document;
      if (!solutionFile) {
        return null;
      }
      return {
        fileName: solutionFile?.originalName,
        fileId: solutionFile?._id
      };
    } else {
      return null;
    }
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  deadlinePassed(assignmentId: string) {
    const time = new Date().getTime();
    const assignment = this.subject()?.assignments?.find( a => a._id == assignmentId);
    return Number(assignment?.deadline) <= time;
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
