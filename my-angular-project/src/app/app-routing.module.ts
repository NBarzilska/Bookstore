import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component'; // Assuming HomeComponent exists
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AuthGuard } from './auth.guard';
import { BookListComponent } from './book-list/book-list.component';

import { BookDetailsComponent } from './book-details/book-details.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { SendMessageComponent } from './send-message/send-message.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: BookListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-book', component: AddBookComponent, canActivate: [AuthGuard] } ,
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/:id/edit', component: BookEditComponent },
  { path: 'sendmessage/:bookId/:ownerId/:username', component: SendMessageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Redirect to login page by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }