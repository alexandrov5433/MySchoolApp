import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { FileService } from '../../services/file.service';
import { mimeTypeLib } from '../../util/mimeTypeLib';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { File } from '../../types/file';
import { NoFilesUploadedComponent } from '../no-files-uploaded/no-files-uploaded.component';

@Component({
  selector: 'app-profile-documents',
  imports: [NoFilesUploadedComponent],
  templateUrl: './profile-documents.component.html',
  styleUrl: './profile-documents.component.css'
})
export class ProfileDocumentsComponent implements OnInit {
  userIdForProfileData: WritableSignal<string> = signal('');
  viewerId: WritableSignal<string> = signal('');

  userDocuments: WritableSignal<Array<File> | null> = signal(null);

  documentFileName: WritableSignal<string> = signal('No file selected.');
  documentFile: File | null = null;
  blob: any = '';
  showFileSelectError: WritableSignal<boolean> = signal(false);

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  uploadDocument() {
    if (!this.documentFile) {
      this.showFileSelectError.set(true);
      return;
    }
    console.log(this.documentFile);

    const formData = new FormData();
    formData.append('document', this.documentFile as any);
    this.profileService.uploadDocument(this.userIdForProfileData(), formData)
      .subscribe({
        next: val => {
          this.showSnackBar(val as string);
        },
        error: err => {
          this.showSnackBar(err as string);
        },
        complete: () => {
          this.loadDocumentsData();
        }
      })
    this.removeDocument();
  }

  getDocument(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.showFileSelectError.set(true);
      event.target.value = '';
      return;
    }
    this.showFileSelectError.set(false);
    this.documentFileName.set(file.name);
    this.documentFile = file;
    event.target.value = '';
  }

  removeDocument() {
    this.documentFileName.set('No file selected.');
    this.documentFile = null;
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
          let extention = null;
          for (let [k, v] of Object.entries(mimeTypeLib)) {
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
    this.profileService.deleteDocument(fileId, this.userIdForProfileData())
    .subscribe({
      next: val => {
        this.showSnackBar(val as string);
      },
      error: err => {
        this.showSnackBar(err as string);
      },
      complete: () => {
        this.loadDocumentsData();
      }
    });
  }

  private loadDocumentsData() {
    this.profileService.getUserDocuments(this.userIdForProfileData())
      .subscribe({
        next: val => this.userDocuments.set(val as Array<File>),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => { }
      });
  }

  ngOnInit(): void {
    this.viewerId.set(this.userService.user_Id);
    this.userIdForProfileData.set(this.route.snapshot.paramMap.get('_id') || '');
    this.loadDocumentsData();
  }
}
