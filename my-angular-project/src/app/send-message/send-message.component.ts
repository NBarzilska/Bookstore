import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../message.model';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})

export class SendMessageComponent implements OnInit {
  owner!: string;
  username!: string;
  bookId!: string;
  messages: Message[] = []; 
  newMessage: string = '';
  sender!: string;
  receiver!: string;
  otherParty!: string;
  userId!: string;

  constructor(private router: Router, private chatService: ChatService, private route: ActivatedRoute, public authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    this.userId = authService.getUserId();
    const state = navigation?.extras.state as {
      bookId: string;
      owner: string;
     // username: string;
      sender: string;
      receiver: string;

    };
    this.bookId = state?.bookId;
    this.owner = state?.owner;
    this.receiver = state?.receiver;
    this.sender = state?.sender;
    //this.username = state?.username;
    if(this.userId == this.receiver){
      this.otherParty = this.sender;
    }else{
      this.otherParty = this.receiver;
    };

    console.log('bookId: ' + this.bookId);
    console.log('ownerId: ' + this.owner);
    console.log('sender: ' + this.sender);

  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    // Fetch messages using ChatService
    this.chatService.getMessages(this.owner,this.bookId, this.sender).subscribe(
      (data: Message[]) => {
        this.messages = data;
        console.log(data);
      },
      error => {
        console.error("Failed to load messages", error);
      }
    );
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageData: Message = {
        sender: this.userId,
        receiver: this.otherParty, 
        book_id: this.bookId, 
        message: this.newMessage,
        date: new Date(), 
        seen: false,
      };

      this.chatService.sendMessage(messageData).subscribe(
        () => {
          this.newMessage = '';
          this.loadMessages();
        },
        error => {
          console.error("Failed to send message", error);
        }
      );
    }
  }

}



