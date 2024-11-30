import { Routes } from '@angular/router';
import { TodoPageComponent } from './basic/todo-page/todo-page.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ApplyNowComponent } from './account/apply-now/apply-now.component';

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

    {path: 'todo-page', component: TodoPageComponent},
];
