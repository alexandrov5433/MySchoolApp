import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Application } from '../../types/application';
import { File } from '../../types/file';
import { FileService } from '../../services/file.service';
import parseServerMsg from '../../util/parseServerMsg';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PendingApplicationService } from '../../services/pending-application.service';

@Component({
  selector: 'app-application-documents',
  imports: [],
  templateUrl: './application-documents.component.html',
  styleUrl: './application-documents.component.css',
  standalone: true
})
export class ApplicationDocumentsComponent {
  private appId: string = '';
  private blob: any = '';
  appData: WritableSignal<Application | null> = signal(null);
  files: WritableSignal<Array<File> | null> = signal(null);
  constructor(
    private pendingAppService: PendingApplicationService,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) { }

  @Input()
  set _id(_id: string) {
    this.appId = _id;
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  downloadFile(_id: string) {
    //TODO
    console.log('DOWNLOAD file _id: ', _id);
    this.fileService.getFileStreamById(_id)
      .subscribe({
        next: (data: any) => {
          this.blob = new Blob([data], { type: data.type });

          const downloadURL = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `file.${data.type.split('/')[1]}`;
          link.click();
        },
        error: err => {
          console.error(err);
          this.showSnackBar(err as string);
        },
        complete: () => { }
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

  ngOnInit(): void {
    this.pendingAppService.getApplicationById(this.appId)
      .subscribe({
        next: val => { },
        error: err => console.error(err),
        complete: () => {
          this.appData.set(this.pendingAppService.pendingApplicationData());
          this.files.set(this.appData()?.applicationDocuments as any);
        }
      });
  }
}
