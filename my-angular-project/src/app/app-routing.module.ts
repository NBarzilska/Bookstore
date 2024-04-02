import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component'; // Assuming HomeComponent exists
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AuthActivate } from './auth.guard';
import { BookListComponent } from './book-list/book-list.component';

import { BookDetailsComponent } from './book-details/book-details.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: BookListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-book', component: AddBookComponent, canActivate: [AuthActivate] } ,
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/:id/edit', component: BookEditComponent },
  { path: 'sendmessage', component: SendMessageComponent },
  { path: 'messages', component: MyMessagesComponent },
  { path: '**', redirectTo: '/404' },
  { path: '404', component: ErrorComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirect to login page by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }