import { UserService } from './services/user.service';
import { Lobby } from './models/Lobby';
import { SignalRService } from './services/signal-r.service';
import { Component, OnInit } from '@angular/core';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';
  lobbys: Lobby[];
  static currentMode: string = "lobby";

  constructor(private signalRService: SignalRService, private userService: UserService) { }

  ngOnInit() {
    this.signalRService.startConnection("lobby");
    this.bindCommands();

    this.signalRService.connectionPromise.then(() => {
      //load lobbys on connect
      this.signalRService.refreshLobbys();
    });
  }

  bindCommands() {
    this.signalRService.registerFunction("MoveToLobby", (lobbyId: string, mode: string) => {
      try {
        console.log(`Moving to lobby ${lobbyId} mode ${mode}`);
        this.signalRService.unregisterFunctions();
        this.signalRService.stopConnection();
        AppComponent.currentMode = "R&P&S";
      }
      catch { }
    });
    this.signalRService.registerFunction("ReceiveLobbies", (lobbys: Lobby[]) => {
      try {
        this.lobbys = lobbys;
      }
      catch { }
    });
    this.signalRService.registerFunction("ReceiveLobby", (lobby: Lobby) => {
      try {
        this.lobbys.push(lobby);
      }
      catch { }
    });
    this.signalRService.registerFunction("UpdateLobby", (lobbyId: string, playersCount: number) => {
      try {
        let lobbyIndex = this.lobbys.findIndex(l => l.id == lobbyId);
        this.lobbys[lobbyIndex].players = playersCount;
        if (playersCount < 1) {
          this.lobbys.splice(lobbyIndex, 1);
        }
      }
      catch { }
    });
    this.signalRService.registerFunction("RemoveLobby", (lobbyId: string) => {
      try {
        let x = this.lobbys.findIndex(x => x.id == lobbyId);
        if (x > -1)
          this.lobbys.splice(x, 1);
      } catch { }
    });
  }

  createNew() {
    AppComponent.currentMode = "create-lobby";
  }

  join(lobbyId: string) {
    let id = lobbyId;
    if (!lobbyId) {
      id = (<HTMLInputElement>document.getElementById("gameId")).value;
    }
    console.log(id);
    this.signalRService.hubConnection.invoke("JoinLobby", id);
  }

  get currentMode(): string {
    return AppComponent.currentMode;
  }
}
