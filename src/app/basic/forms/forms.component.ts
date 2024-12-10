import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionsAndFormsService } from '../../services/questions-and-forms.service';
import { FileService } from '../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mimeTypeLib } from '../../util/mimeTypeLib';
import { Form } from '../../types/form';


@Component({
  selector: 'app-forms',
  imports: [],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
  standalone: true
})
export class FormsComponent implements OnInit {
  formsData: WritableSignal<Array<Form> | null> = signal(null);
  isUserTeacher: Signal<boolean> = computed(() => {
    if (this.userService.userAuthStatus === 'teacher') {
      return true;
    }
    return false;
  });

  formFileName: WritableSignal<string> = signal('No file selected.');
  formFile: File | null = null;
  blob: any = '';
  showFileSelectError: WritableSignal<boolean> = signal(false);
  constructor(
    private userService: UserService,
    private questionsAndFormsService: QuestionsAndFormsService,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  createForm() {
    if(!this.formFile) {
      this.showFileSelectError.set(true);
      return;
    }
    this.showFileSelectError.set(false);
    const formData = new FormData();
    formData.append('form', this.formFile);
    this.questionsAndFormsService.publishForm(formData)
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => {
          this.loadFormsData();
          this.removeFile();
        }
      });
    
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
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
          link.download = `form.${extention ? extention : 'unknown'}`;
          link.click();
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err as string);
        },
        complete: () => { }
      });
  }

  deleteForm(formId: string) {
    this.questionsAndFormsService.deleteForm(formId)
    .subscribe({
      next: val => {
        this.showSnackBar(val as string);
      },
      error: err => {
        console.error(err);
        this.showSnackBar(err as string);
      },
      complete: () => {
        this.loadFormsData();
      }
    });
  }

  getFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.showFileSelectError.set(true);
      this.removeFile();
      event.target.value = '';
      return;
    }
    event.target.value = '';
    this.showFileSelectError.set(false);
    this.formFileName.set(file.name);
    this.formFile = file;
  }

  removeFile() {
    this.formFileName.set('No file selected.');
    this.formFile = null;
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

  private loadFormsData() {
    this.questionsAndFormsService.getFormsData()
      .subscribe({
        next: val => this.formsData.set(val as Array<Form>),
        error: err => {
          console.error(err);
          this.showSnackBar(err)
        },
        complete: () => {}
      });
  }

  ngOnInit(): void {
    this.loadFormsData();
  }

}
