import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000'; // Adjust as necessary

  constructor(private http: HttpClient) { }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }

  sendMessage(message: Message): Observable<Message> {
    console.log(message);
    return this.http.post<Message>(`${this.apiUrl}/sendmessage`, message);
  }
}
