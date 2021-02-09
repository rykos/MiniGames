import { SignalRService } from './../services/signal-r.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss']
})
export class CreateLobbyComponent implements OnInit {
  form: FormGroup;
  modes: string[] = ["R&P&S"];
  constructor(private formBuider: FormBuilder, private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.form = this.formBuider.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mode: [this.modes[0], Validators.required],
      maxPlayers: [1, Validators.required],
      public: [false, Validators.required]
    });
  }

  createLobby() {
    console.log(this.form.value);
    this.signalRService.createLobby(
      this.form.get('name').value,
      this.form.get('mode').value,
      this.form.get('maxPlayers').value,
      this.form.get('public').value
    );
  }

}
