export class RpsGameState {
    active: boolean;//Round is active
    acted: boolean;//Made move
    canAct: boolean;//Can make act
    roundStart: Date;//Time at which round started
    roundEnd: Date;//Time at which round will end
    timeLeft: number;

    constructor(x: Date, y: Date) {
        this.canAct = true;
        this.active = true;
        this.acted = true;
        this.roundStart = x;
        this.roundEnd = y;
        this.timeLeft = (this.roundEnd.getTime() - Date.now()) / 1000;
    }

    closeRound() {
        this.active = false;
        this.canAct = false;
        this.timeLeft = 0;
    }

    openRound() {
        this.active = true;
        this.canAct = true;
        this.timeLeft = (this.roundEnd.getTime() - Date.now()) / 1000;
    }
}