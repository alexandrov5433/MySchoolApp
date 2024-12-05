import { Component, signal, WritableSignal } from '@angular/core';
import { Application } from '../../types/application';
import { InterElementCommunicationService } from '../../services/inter-element-communication.service';
import { File } from '../../types/file';
import { FileService } from '../../services/file.service';
import parseServerMsg from '../../util/parseServerMsg';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-application-documents',
  imports: [],
  templateUrl: './application-documents.component.html',
  styleUrl: './application-documents.component.css',
  standalone: true
})
export class ApplicationDocumentsComponent {
  // private appId: string = '';
  appData: WritableSignal<Application | null> = signal(null);
  files: WritableSignal<Array<File> | null> = signal(null);
  constructor(
    private iec: InterElementCommunicationService,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) { }

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
    this.fileService.getFileDownloadById(_id)
      .subscribe({
        next: val => {
          console.log(val);
        },
        error: err => {
          console.error(err);
          const msg = parseServerMsg(err.error).msg;
          this.showSnackBar(msg);
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
    this.appData.set(this.iec.pendingApplicationData());
    console.log('app-details-cmp. _id: ', this.appData()?._id);
    this.files.set(this.appData()?.applicationDocuments as any);
  }
}
