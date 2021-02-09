import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateLobbyComponent } from './create-lobby/create-lobby.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RockPaperScissorsComponent } from './rock-paper-scissors/rock-paper-scissors.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateLobbyComponent,
    RockPaperScissorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
