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
    this.setup();

    this.signalRService.connectionPromise.then(() => {
      //load lobbys on connect
      this.signalRService.refreshLobbys();
    });
  }

  setup() {
    this.signalRService.hubConnection.on('ReceiveLobbies', (lobbys: Lobby[]) => {
      this.lobbys = lobbys;
    });
    this.signalRService.hubConnection.on('ReceiveLobby', (lobby: Lobby) => {
      this.lobbys.push(lobby);
    });
    this.signalRService.hubConnection.on('UpdateLobby', (lobbyId: string, playersCount: number) => {
      try {
        this.lobbys.filter(l => l.id == lobbyId)[0].players = playersCount;
      }
      catch { }
    });
    this.signalRService.hubConnection.on('RemoveLobby', (lobbyId: string) => {
      let x = this.lobbys.findIndex(x => x.id == lobbyId);
      if (x > -1)
        this.lobbys.splice(x, 1);
    });
    this.signalRService.hubConnection.on('MoveToLobby', (lobbyId: string, mode: string) => {
      console.log(`Moving to lobby ${lobbyId} mode ${mode}`);
      this.signalRService.stopConnection();
      AppComponent.currentMode = "R&P&S";
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
