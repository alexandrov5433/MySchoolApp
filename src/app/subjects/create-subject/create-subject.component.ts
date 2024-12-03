import { Component, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-subject',
  imports: [],
  templateUrl: './create-subject.component.html',
  styleUrl: './create-subject.component.css'
})
export class CreateSubjectComponent {
  showError: WritableSignal<boolean> = signal(false);

  constructor(private router: Router) {}

  onCreate(title: string) {
    title = title.trim();
    console.log(title);
    if (!title) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
}
