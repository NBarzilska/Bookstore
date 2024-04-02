import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommunicationThread  } from '../thread.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css']
})
export class MyMessagesComponent implements OnInit {
  communicationThreads: CommunicationThread[] = [];
  userId!: string;

  constructor(private router: Router, private chatService: ChatService, private authService: AuthService) { 
    this.userId = authService.getUserId(); 
  }

  ngOnInit() {
    this.loadMyMessages();
  }

  loadMyMessages() {
 
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
    if (this.userId == thread.owner){
      threadReceiver = this.userId;
      threadSender = thread.otherParty;
    } else {
      threadReceiver = thread.otherParty;
      threadSender = this.userId;
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

}
