import { PaginationResult } from './../_models/pagination';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Message } from './../_models/message';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '../_models/pagination';

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = "Unread";

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(m => {
      this.messages = m['messages'].result;
      this.pagination = m['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer).subscribe((res : PaginationResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.alertify.confirm("Are you sure you want to delete this message?", () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
        this.alertify.success("Message has been deleted");
      }, error => {
        this.alertify.error("Failed to delete the message");
      });
    });
  }
}
