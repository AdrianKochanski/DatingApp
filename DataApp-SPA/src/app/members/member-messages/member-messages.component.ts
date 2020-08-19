import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { tap } from 'rxjs/operators';

@Component({
  selector: "app-member-messages",
  templateUrl: "./member-messages.component.html",
  styleUrls: ["./member-messages.component.css"],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThred(this.authService.decodedToken.nameid, this.recipientId).pipe(
        tap(m => {
          for (let i = 0; i < m.length; i++) {
            if(!m[i].isRead && m[i].recipientId===currentUserId) {
              this.userService.markAsRead(currentUserId, m[i].id);
            }
          }
        })
      )
      .subscribe(
        (data) => {
          this.messages = data;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.RecipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: Message)=> {
      this.messages.push(message);
      this.newMessage = {};
    }, error => {
      this.alertify.error(error);
    });
  }
}
