import { Component, computed, Input, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject as rxjsSubject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { FileService } from '../../../services/file.service';
import { SubjectsService } from '../../../services/subjects.service';
import { Subject } from '../../../types/subject';
import { mimeTypeLib } from '../../../util/mimeTypeLib';


@Component({
  selector: 'app-subject-materials',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-materials.component.html',
  styleUrl: './subject-materials.component.css'
})
export class SubjectMaterialsComponent implements OnInit, OnDestroy {
  private ngDestroyer = new rxjsSubject();
  subject: WritableSignal<Subject | null> = signal(null);
  subjectId: string = '';
  curUserStatus: WritableSignal<string> = signal('');
  curUserId: WritableSignal<string> = signal('');

  materialFileName: WritableSignal<string> = signal('No file selected.');
  materialFile: File | null = null;
  blob: any = '';
  showFileSelectError: WritableSignal<boolean> = signal(false);

  constructor(
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private fileService: FileService
  ) { }

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

  createMaterial() {
    if(!this.materialFile) {
      this.showFileSelectError.set(true);
      return;
    }
    this.showFileSelectError.set(false);
    const formData = new FormData();
    formData.append('subjectId', this.subjectId);
    formData.append('material', this.materialFile);
    this.subjectsService.createMaterial(formData)
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
      this.removeFile();
  }

  getFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.showFileSelectError.set(true);
      this.removeFile();
      return;
    }
    this.showFileSelectError.set(false);
    this.materialFileName.set(file.name);
    this.materialFile = file;
  }

  removeFile() {
    this.materialFileName.set('No file selected.');
    this.materialFile = null;
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

  getFileIconPath(mimeType: string) {
    if (mimeType === 'application/pdf') {
      return '/icons/pdf/128.png';
    } else if (mimeType === 'image/png') {
      return '/icons/png/128.png';
    } else if (mimeType === 'image/jpeg') {
      return '/icons/image/128.png';
    } else {
      return '/icons/unknownfile/128.png';
    }
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
          link.download = `material.${extention ? extention : 'unknown'}`;
          link.click();
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err as string);
        },
        complete: () => { }
      });
  }

  deleteFile(fileId: string) {
    this.subjectsService.removeMaterial(this.subjectId, fileId)
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
          console.log(this.subject());
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
