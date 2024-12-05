import { Routes } from '@angular/router';
import { TodoPageComponent } from './basic/todo-page/todo-page.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ApplyNowComponent } from './account/apply-now/apply-now.component';
import { CreateSubjectComponent } from './subjects/create-subject/create-subject.component';
import { AllSubjectsComponent } from './subjects/all-subjects/all-subjects.component';
import { MySubjectsComponent } from './subjects/my-subjects/my-subjects.component';
import { SubjectDetailsComponent } from './subjects/subject/subject-details/subject-details.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', redirectTo: '/todo-page'},
    {path: 'about', redirectTo: '/todo-page'},
    {path: 'contact', redirectTo: '/todo-page'},
    {path: 'faq', redirectTo: '/todo-page'},
    {path: 'forms-and-documents', redirectTo: '/todo-page'},

    {path: 'log-in', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'apply-now', component: ApplyNowComponent},
    
    {path: 'create-subject', component: CreateSubjectComponent},
    {path: 'all-subjects', component: AllSubjectsComponent},
    {path: 'my-subjects', component: MySubjectsComponent},
    {path: 'subject-details/:_id', component: SubjectDetailsComponent, 
        children: [
            
        ]
    },


    {path: 'todo-page', component: TodoPageComponent},
];
