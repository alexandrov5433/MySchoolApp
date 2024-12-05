import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { subjectCardsSearchResult } from '../../types/subjectCardsRearchResult';
import { Router } from '@angular/router';
import { SubjectsService } from '../../services/subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import parseServerMsg from '../../util/parseServerMsg';

@Component({
  selector: 'app-all-subjects',
  imports: [],
  templateUrl: './all-subjects.component.html',
  styleUrl: './all-subjects.component.css',
  standalone: true
})
export class AllSubjectsComponent implements OnInit {
  subjectCards: WritableSignal<subjectCardsSearchResult | null> = signal(null);

  constructor(
    private router: Router,
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

  view(_id: string) {
    console.log(_id);
    this.router.navigate([`/subject-details/${_id}`]);
  }

  search(title: string, displayId: string) {
    console.log(title, displayId);
    this.getSubjects(title, displayId);
  }

  ngOnInit(): void {
    //get all subjects
    this.getSubjects('', '');
  }

  private getSubjects(title: string, displayId: string) {
    this.subjectsService.getSubjects(title, displayId)
      .subscribe({
        next: val => {
          const subjectCardsResult: subjectCardsSearchResult = parseServerMsg(val as string);
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
