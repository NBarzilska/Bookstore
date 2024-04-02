import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model'; 
import { CommunicationThread } from './thread.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  getMessages(ownerId: string, bookId: string, sender: string ): Observable<Message[]> {
    let params = new HttpParams()
    .set('ownerId', ownerId)
    .set('bookId', bookId)
    .set('sender', sender);
    return this.http.get<Message[]>(`/api/messages`, { params: params });
  }

  sendMessage(message: Message): Observable<Message> {
    console.log(message);
    return this.http.post<Message>(`/api/sendmessage`, message);
  }

  getMyMessages(userId: string): Observable<CommunicationThread[]> {
    return this.http.get<any[]>(`/api/mymessages?userId=${userId}`);
  }
}
