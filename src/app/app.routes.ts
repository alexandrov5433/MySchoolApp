import { Routes } from '@angular/router';
import { TodoPageComponent } from './basic/todo-page/todo-page.component';
import { LoginComponent } from './account/login/login.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', redirectTo: '/todo-page'},
    {path: 'about', redirectTo: '/todo-page'},
    {path: 'contact', redirectTo: '/todo-page'},
    {path: 'faq', redirectTo: '/todo-page'},
    {path: 'forms-and-documents', redirectTo: '/todo-page'},
    {path: 'log-in', component: LoginComponent},
    {path: 'register', redirectTo: '/todo-page'},
    {path: 'apply-now', redirectTo: '/todo-page'},


    {path: 'todo-page', component: TodoPageComponent},
];
