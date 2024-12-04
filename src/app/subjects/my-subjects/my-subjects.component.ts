import { Component, signal, WritableSignal } from '@angular/core';
import { subjectCardsSearchResult } from '../../types/subjectCardsRearchResult';
import { Router } from '@angular/router';
import { SubjectsService } from '../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';

@Component({
  selector: 'app-my-subjects',
  imports: [],
  templateUrl: './my-subjects.component.html',
  styleUrl: './my-subjects.component.css'
})
export class MySubjectsComponent {
  subjectCards: WritableSignal<subjectCardsSearchResult | null> = signal(null);

  constructor (
    private router: Router,
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar
  ) {}

  showSnackBar(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 7000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  view(_id: string) {
    console.log(_id);
    //TODO redirect to subject
  }

  ngOnInit(): void {
    //get all subjects
    this.getMySubjects();
  }

  private getMySubjects() {
    this.subjectsService.getSubjects('', '', true)
      .subscribe({
        next: val => {
          const subjectCardsResult: subjectCardsSearchResult = parseServerMsg(val as string);
          console.log(subjectCardsResult);
          
          this.subjectCards.set(subjectCardsResult);
        },
        error: err => {
          const msg = parseServerMsg(err.error).msg;
          console.error(msg);
          this.showSnackBar(msg);
        },
        complete: () => {}
      });
  }

}
