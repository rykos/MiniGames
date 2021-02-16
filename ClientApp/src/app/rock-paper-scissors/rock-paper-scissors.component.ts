import { Player } from './../models/Player';
import { SignalRService } from './../services/signal-r.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rock-paper-scissors',
  templateUrl: './rock-paper-scissors.component.html',
  styleUrls: ['./rock-paper-scissors.component.scss']
})
export class RockPaperScissorsComponent implements OnInit {

  players: Player[];
  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    // RPS
    this.signalRService.disconnectionPromise.then(() => {
      this.signalRService.startConnection("rockpaperscissors");
      this.signalRService.connectionPromise.then(() => {
        this.bindCommands();
        this.signalRService.hubConnection.invoke("GetState");
      });
    });
  }

  private bindCommands() {
    this.signalRService.registerFunction("Done", (userId: string) => {
      console.log(`${userId} is done`);
    });
    this.signalRService.registerFunction("Reveal", (actions: any[]) => {
      console.log(actions);
    });
    this.signalRService.registerFunction("UpdateGameState", (gamestate) => {
      this.players = gamestate.activeUsers;
      console.log(gamestate);
    });
    this.signalRService.registerFunction("UserLeft", (userId: string) => {
      console.log(userId);
      this.players = this.players.filter(p => p.id != userId);
    });
    this.signalRService.registerFunction("UserJoined", (player: Player) => {
      console.log(player);
      this.players.push(player);
    });
  }

  private unbindCommands() {
    this.signalRService.unregisterFunctions();
  }

  use(action: string) {
    console.log(action);
    this.signalRService.hubConnection.invoke('Use', action);
  }

}
