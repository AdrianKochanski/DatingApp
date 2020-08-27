import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from './../_models/message';
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  public connectionId: string;
  private _subject = new BehaviorSubject<Message>(null);
  public newMessage$ = this._subject as Observable<Message>;
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {accessTokenFactory: () => localStorage.getItem('token')})
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .then(() => this.getConnectionId())
      .catch((err) => console.log("Error while starting connection: " + err));
  };

  public listenNewMessages = () => {
    this.hubConnection.on("newMessage", (data: Message) => {
      this._subject.next(data);
    });
  };

  public broadcastNewMessage = (message: Message) => {
    this.hubConnection
      .invoke("broadcastnewmessage", message)
      .catch((err) => console.error(err));
  };

  public getConnectionId = () => {
    this.hubConnection
      .invoke("getconnectionid").then((data) => {
      console.log(data);
      this.connectionId = data;
    });
  };
}
