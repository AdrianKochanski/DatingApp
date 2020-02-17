import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginationResult } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  user: User = JSON.parse(localStorage.getItem('user'));
  users: User[];
  pagination: Pagination;
  likesParam: string;
  userParams: any = {};

  constructor(
    private authServ: AuthService,
    private route: ActivatedRoute,
    private userServ: UserService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });
    this.likesParam = 'Likers';
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userServ.getUsers(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.userParams,
      this.likesParam)
      .subscribe((users: PaginationResult<User[]>) => {
      this.users = users.result;
      this.pagination = users.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
