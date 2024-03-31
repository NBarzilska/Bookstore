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
import { ReactiveFormsModule } from '@angular/forms';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import { BookService } from './book.service';
import { ProfileComponent } from './profile/profile.component';
import { ChunkPipe } from './chunk.pipe';
import { SendMessageComponent } from './send-message/send-message.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';

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
    BookDetailsComponent,
    BookEditComponent,
    ProfileComponent,
    ChunkPipe,
    SendMessageComponent,
    MyMessagesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    BookService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {}