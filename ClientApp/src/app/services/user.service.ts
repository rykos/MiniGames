import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  id: string;
  constructor() {
    this.id = localStorage.getItem("userid");
    if (!this.id) {
      this.refreshId();
    }
  }

  getId(): string {
    return localStorage.getItem("userid");
  }

  refreshId(): string {
    let newId = Guid.newGuid();
    localStorage.setItem("userid", newId);
    return newId;
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}