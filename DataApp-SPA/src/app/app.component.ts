import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';
import { SignalRService } from './_services/signal-r.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "DataApp-SPA";
  jwtHelper = new JwtHelperService();

  constructor(
    private authServ: AuthService,
    public signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.listenNewMessages();
    this.signalRService.listenNewActivities();
    const user: User = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (token) {
      this.authServ.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authServ.currentUser = user;
      this.authServ.changeMemberPhoto(user.photoUrl);
    }
  }
}
