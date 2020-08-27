import { Activity } from './../../_models/activity';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  activityNotified = false;
  inThrottle: boolean;
  messages: Message[];
  newMessage: any = {};
  scrollMessages: HTMLElement;
  scrollDown = false;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {}

  ngAfterViewChecked(): void {
    if (this.scrollDown)
      this.scrollMessages.scrollTop = this.scrollMessages.scrollHeight;
  }

  ngOnInit() {
    this.loadMessages();
    this.scrollMessages = document.getElementById("card-messages");
    this.signalRService.newMessage$.subscribe(
      (data) => {
        if (data == null || data.senderId != this.recipientId) return;
        this.messages.push(data);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
    this.signalRService.newActivity$.subscribe(
      (data) => {
        if (data == null || data.senderId != this.recipientId) return;
        this.activityNotified = data.isTyping;
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  scrollEvent() {
    this.scrollDown = false;
  }

  loadMessages() {
    this.scrollDown = true;
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
    this.scrollDown = true;
    this.newMessage.RecipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.push(message);
          this.signalRService.broadcastNewMessage(message);
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

  onInput(value: string) {
    let activity: Activity = {
      isTyping: false,
      recipientId: this.recipientId,
      senderId: +this.authService.decodedToken.nameid,
    };
    if(!value) this.signalRService.broadcastNewActivity(activity);
    if (this.inThrottle) return;
    activity.isTyping = true;
    if (value) this.signalRService.broadcastNewActivity(activity);
    this.inThrottle = true;
    setTimeout(() => {
      this.inThrottle = false;
    }, 1000);
  }
}
