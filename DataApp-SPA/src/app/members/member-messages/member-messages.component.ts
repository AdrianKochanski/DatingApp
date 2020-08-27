import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit, Input, AfterViewInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { tap } from 'rxjs/operators';
import { SignalRService } from 'src/app/_services/signal-r.service';

@Component({
  selector: "app-member-messages",
  templateUrl: "./member-messages.component.html",
  styleUrls: ["./member-messages.component.css"],
})
export class MemberMessagesComponent implements OnInit, AfterViewChecked {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  scrollMessages: HTMLElement;
  showNewMessage = false;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {}

  ngAfterViewChecked(): void {
    if(this.showNewMessage)
      this.scrollMessages.scrollTop = this.scrollMessages.scrollHeight;
  }

  ngOnInit() {
    this.loadMessages();
    this.scrollMessages = document.getElementById("card-messages");
    this.signalRService.newMessage$.subscribe(
      (data) => {
        if(data == null) return;
        this.messages.push(data);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  scrollEvent() {
    this.showNewMessage = false;
  }

  loadMessages() {
    this.showNewMessage = true;
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService
      .getMessageThred(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap((m) => {
          for (let i = 0; i < m.length; i++) {
            if (!m[i].isRead && m[i].recipientId === currentUserId) {
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
    this.showNewMessage = true;
    this.newMessage.RecipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.push(message);
          this.signalRService.broadcastNewMessage(message);
          this.newMessage = {};
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  ShowTimeAgo(element: HTMLElement) {
    element.classList.remove("hidden");
    setTimeout(() => {
      element.classList.add("hidden");
    }, 1000);
  }
}
