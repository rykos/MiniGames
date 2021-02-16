import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';
import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: HubConnection;
  public connectionPromise: Promise<void>;
  public disconnectionPromise: Promise<void>;
  private registeredFunctions: string[] = [];

  constructor(private userService: UserService) { }

  public startConnection(hubName: string) {
    let id = this.userService.getId();
    console.log(id);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/hub/${hubName}?uid=${this.userService.getId()}`)
      .build();
    this.connectionPromise = this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public stopConnection() {
    return this.disconnectionPromise = this.hubConnection.stop();
  }

  public registerFunction(name: string, action: (...args) => void) {
    this.registeredFunctions.push(name);
    this.hubConnection.on(name, action);
  }

  public unregisterFunctions() {
    for (let i = this.registerFunction.length - 1; i >= 0; i--) {
      this.hubConnection.off(this.registerFunction[i]);
      this.registeredFunctions.pop();
    }
  }

  public refreshLobbys() {
    this.hubConnection.invoke('RefreshLobbys');
  }

  public createLobby(name: string, mode: string, maxPlayers, publicLobby: boolean) {
    this.hubConnection.invoke('CreateLobby', name, mode, maxPlayers, publicLobby);
  }
}
