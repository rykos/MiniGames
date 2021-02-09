import { SignalRService } from './../services/signal-r.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rock-paper-scissors',
  templateUrl: './rock-paper-scissors.component.html',
  styleUrls: ['./rock-paper-scissors.component.scss']
})
export class RockPaperScissorsComponent implements OnInit {

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    // RPS
    this.signalRService.disconnectionPromise.then(() => {
      this.signalRService.startConnection("rockpaperscissors");
      this.signalRService.connectionPromise.then(() => {
        console.log("binding shit");
        this.signalRService.hubConnection.on('Done', (userId: string) => {
          console.log(`${userId} is done`);
        });
        this.signalRService.hubConnection.on('Reveal', (actions: any[]) => {
          console.log(actions);
        });
      });
    });
  }

  use(action: string) {
    console.log(action);
    this.signalRService.hubConnection.invoke('Use', action);
  }

}
