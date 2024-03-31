import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommunicationThread  } from '../thread.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css']
})
export class MyMessagesComponent implements OnInit {
  communicationThreads: CommunicationThread[] = [];
  userId!: string;

  constructor(private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.loadMyMessages();
  }

  loadMyMessages() {
    this.userId = this.getUserIdFromLocalStorage(); 
    this.chatService.getMyMessages(this.userId).subscribe(data => {
      this.communicationThreads = data;
      console.log(data);
    }, error => {
      console.error('Error fetching messages:', error);
    });
  }

  openChat(thread: CommunicationThread): void {
    var threadReceiver = '';
    var threadSender = '';
    if (this.getUserIdFromLocalStorage() == thread.owner){
      threadReceiver = this.getUserIdFromLocalStorage();
      threadSender = thread.otherParty;
    } else {
      threadReceiver = thread.otherParty;
      threadSender = this.getUserIdFromLocalStorage();
    };
    console.log(threadSender, threadReceiver);
    
    this.router.navigate(['/sendmessage'], {
      state: {
        bookId: thread._id,
        owner: thread.owner,
        receiver: threadReceiver,
        sender: threadSender
      }
    });
  }

  getUserIdFromLocalStorage(): string {
    const currentUserId = localStorage.getItem('userId');
    console.log(currentUserId);
    if (currentUserId != null) {
      return currentUserId;
    } else {
      return '';
    };
  };
}
