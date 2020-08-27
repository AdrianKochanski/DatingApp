import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from './../_models/message';
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { Activity } from '../_models/activity';

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  public connectionId: string;
  private _subjectMessage = new BehaviorSubject<Message>(null);
  public newMessage$ = this._subjectMessage as Observable<Message>;
  private _subjectActivity = new BehaviorSubject<Activity>(null);
  public newActivity$ = this._subjectActivity as Observable<Activity>;
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .then(() => this.getConnectionId())
      .catch((err) => console.log("Error while starting connection: " + err));
  };

  public listenNewMessages = () => {
    this.hubConnection.on("newMessage", (data: Message) => {
      this._subjectMessage.next(data);
    });
  };

  public listenNewActivities = () => {
    this.hubConnection.on("newActivity", (data: Activity) => {
      console.log("NewActivity: ", data.isTyping);
      this._subjectActivity.next(data);
    });
  };

  public broadcastNewMessage = (message: Message) => {
    this.hubConnection
      .invoke("broadcastnewmessage", message)
      .catch((err) => console.error(err));
  };

  public broadcastNewActivity = (activity: Activity) => {
    this.hubConnection
      .invoke("broadcastnewactivity", activity)
      .catch((err) => console.error(err));
  };

  public getConnectionId = () => {
    this.hubConnection.invoke("getconnectionid").then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  };
}
