import { Routes } from '@angular/router';
import { TodoPageComponent } from './basic/todo-page/todo-page.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ApplyNowComponent } from './account/apply-now/apply-now.component';
import { CreateSubjectComponent } from './subjects/create-subject/create-subject.component';
import { AllSubjectsComponent } from './subjects/all-subjects/all-subjects.component';
import { MySubjectsComponent } from './subjects/my-subjects/my-subjects.component';
import { SubjectDetailsComponent } from './subjects/subject/subject-details/subject-details.component';
import { PendingApplicationsComponent } from './application/pending-applications/pending-applications.component';
import { ApplicationMainComponent } from './application/application-main/application-main.component';
import { ApplicationDetailsComponent } from './application/application-details/application-details.component';
import { ApplicationDocumentsComponent } from './application/application-documents/application-documents.component';
import { SubjectParticipantsComponent } from './subjects/subject/subject-participants/subject-participants.component';
import { SubjectAnnouncementsComponent } from './subjects/subject/subject-announcements/subject-announcements.component';
import { SubjectAssignmentsComponent } from './subjects/subject/subject-assignments/subject-assignments.component';
import { SubjectMaterialsComponent } from './subjects/subject/subject-materials/subject-materials.component';
import { ProfileMainComponent } from './profile/profile-main/profile-main.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { ProfileDocumentsComponent } from './profile/profile-documents/profile-documents.component';
import { ProfileGradesComponent } from './profile/profile-grades/profile-grades.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', redirectTo: '/todo-page' },
    { path: 'about', redirectTo: '/todo-page' },
    { path: 'contact', redirectTo: '/todo-page' },
    { path: 'faq', redirectTo: '/todo-page' },
    { path: 'forms-and-documents', redirectTo: '/todo-page' },

    { path: 'log-in', component: LoginComponent, title: 'Log In' },
    { path: 'register', component: RegisterComponent, title: 'Register' },
    { path: 'apply-now', component: ApplyNowComponent, title: 'Apply Now' },

    { path: 'create-subject', component: CreateSubjectComponent, title: 'Create New Subject' },
    { path: 'all-subjects', component: AllSubjectsComponent, title: 'All Subjects' },
    { path: 'my-subjects', component: MySubjectsComponent, title: 'My Subjects' },
    {
        path: 'subject-details/:_id', component: SubjectDetailsComponent, title: 'Subject', children: [
            { path: 'participants', component: SubjectParticipantsComponent, title: 'Subject Participants' },
            { path: 'announcements', component: SubjectAnnouncementsComponent, title: 'Subject Announcements' },
            { path: 'assignments', component: SubjectAssignmentsComponent, title: 'Subject Assignments' },
            { path: 'materials', component: SubjectMaterialsComponent, title: 'Subject Materials' }
        ]
    },

    { path: 'pending-applications', component: PendingApplicationsComponent, title: 'Pending Applications' },
    {
        path: 'application/:_id', component: ApplicationMainComponent, title: 'Application', children: [
            { path: 'details', component: ApplicationDetailsComponent, title: 'Application - Details' },
            { path: 'documents', component: ApplicationDocumentsComponent, title: 'Application - Documents', }
        ]
    },
    {
        path: 'profile/:_id', component: ProfileMainComponent, title: 'Profile', children: [
            { path: 'details', component: ProfileDetailsComponent, title: 'Profile - Details' },
            { path: 'documents', component: ProfileDocumentsComponent, title: 'Profile - Documents', },
            { path: 'grades', component: ProfileGradesComponent, title: 'Profile - Grades', }
        ]
    },


    { path: 'todo-page', component: TodoPageComponent },
];
