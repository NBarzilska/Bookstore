import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BookListComponent } from './book-list/book-list.component';
import { AddBookComponent } from './add-book/add-book.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NavbarComponent,
    TestComponentComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    AboutComponent,
    ContactComponent,
    BookListComponent,
    AddBookComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}