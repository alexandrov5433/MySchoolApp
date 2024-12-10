import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FaqEntry } from '../../types/faqEntry';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionsAndFormsService } from '../../services/questions-and-forms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-frequent-questions',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './frequent-questions.component.html',
  styleUrl: './frequent-questions.component.css',
  standalone: true
})
export class FrequentQuestionsComponent implements OnInit {
  isTeacherViewing: Signal<boolean> = computed(() => {
    return this.userService.userAuthStatus === 'teacher' ? true : false;
  });
  faqData: WritableSignal<Array<FaqEntry> | null> = signal(null);
  form = new FormGroup({
    question: new FormControl('', [Validators.required]),
    answer: new FormControl('', [Validators.required]),
  });
  validationLib = {
    question: {
      showErrMsg: false,
      validationClass: ''
    },
    answer: {
      showErrMsg: false,
      validationClass: ''
    }
  }
  constructor(
    private userService: UserService,
    private questionsAndFormsService: QuestionsAndFormsService,
    private snackBar: MatSnackBar
  ) {}

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
}

  publish() {
   this.validate();
   if(this.form.invalid) {
    console.log(this.form.invalid);
    
    return;
   }
   const question = this.form.get('question')?.value;
   const answer = this.form.get('answer')?.value;
   this.clearFields();
   const formData = new FormData();
   formData.append('question', question || '');
   formData.append('answer', answer || '');
   this.questionsAndFormsService.publishFaqEntry(formData)
    .subscribe({
      next: val => this.showSnackBar(val as string),
      error: err => {
        console.error(err);
        this.showSnackBar(err);
      },
      complete: () => {
        this.loadFaqData();
      }
    });
   
  }

  deleteFaqEntry(_id: string) {
    this.questionsAndFormsService.deleteFaqEntry(_id)
      .subscribe({
        next: val => this.showSnackBar(val as string),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => this.loadFaqData()
      });
  }

  validate() {
    const question = this.form.get('question')?.value;
    const answer = this.form.get('answer')?.value;
    if (!question) {
      this.validationLib.question.showErrMsg = true;
      this.validationLib.question.validationClass = 'false-input';
    } else {
      this.validationLib.question.showErrMsg = false;
      this.validationLib.question.validationClass = 'correct-input';
    }
    if (!answer) {
      this.validationLib.answer.showErrMsg = true;
    } else {
      this.validationLib.answer.showErrMsg = false;
    }
  }

  clearFields() {
    this.form.reset();
    this.validationLib.question.showErrMsg = false;
    this.validationLib.question.validationClass = '';
    this.validationLib.answer.showErrMsg = false;
  }

  private loadFaqData() {
    this.questionsAndFormsService.getFaqData()
      .subscribe({
        next: val => this.faqData.set(val as Array<FaqEntry>),
        error: err => {
          console.error(err);
          this.showSnackBar(err);
        },
        complete: () => {}
      });
  }

  ngOnInit(): void {
    this.loadFaqData();
    
  }


}
