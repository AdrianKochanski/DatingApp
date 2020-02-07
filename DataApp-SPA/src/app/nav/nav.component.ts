import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    private authServ: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  OnLogin() {
    this.authServ.login(this.model).subscribe(next => {
      this.alertify.success('Logged in succesfully !!!');
    }, error => {
      this.alertify.error(error);
    });
  }

  loggedIn() {
    return this.authServ.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }

}
