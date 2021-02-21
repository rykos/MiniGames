import { UserService } from './../services/user.service';
import { RpsGameState } from './../models/RpsGameState';
import { Player } from './../models/Player';
import { SignalRService } from './../services/signal-r.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rock-paper-scissors',
  templateUrl: './rock-paper-scissors.component.html',
  styleUrls: ['./rock-paper-scissors.component.scss']
})
export class RockPaperScissorsComponent implements OnInit {

  players: Player[];
  gameState: RpsGameState;
  timerId: NodeJS.Timeout;

  constructor(private signalRService: SignalRService) {
    this.gameState = new RpsGameState(new Date(), new Date(new Date().getTime() + 60 * 1000));
    console.log(this.gameState.roundStart);
    console.log(this.gameState.roundEnd);
    this.startRound();
  }

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

  timeLeft(): string {
    if (this.gameState)
      return `${this.gameState.timeLeft} seconds`;
    else
      return null;
  }

  finishRound() {
    clearInterval(this.timerId);
    this.gameState.closeRound();
  }

  startRound() {
    this.timerId = setInterval(() => {
      if (this.gameState.timeLeft > 0)
        this.gameState.timeLeft -= 1;
      else
        clearInterval(this.timerId);
    }, 1000);
  }

}
