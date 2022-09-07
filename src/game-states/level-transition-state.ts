import {State} from "@/core/state";
import {LevelCallback} from "@/game-states/levels/level-callback";
import {getLevel1} from "@/game-states/levels/level-1";
import {getLevel2} from "@/game-states/levels/level-2";
import {drawEngine} from "@/core/draw-engine";
import {getGameStateMachine} from "@/game-state-machine";
import {gameState} from "@/game-states/game-state";
import {scores} from "@/engine/scores";

class LevelTransitionState implements State {
  levels: LevelCallback[] = [getLevel1, getLevel2]
  currentLevelNumber = -1
  framesElapsed = 0;

  constructor() {

  }

  onEnter(levelToEnter: number) {
    this.currentLevelNumber = levelToEnter;
    this.framesElapsed = 0;
  }

  onUpdate(timeElapsed: number): void {
    drawEngine.context.clearRect(0,0,1000,1000)
    // TODO: increase time
    if (this.framesElapsed > 10) {
      getGameStateMachine().setState(gameState, this.levels[this.currentLevelNumber - 1])
      return;
    }
    // draw menu
    this.framesElapsed += 1;
    drawEngine.drawText(`Hole ${this.currentLevelNumber}`, 50, 500, 500);
    scores.drawScorecard();
  }
}

export const levelTransitionState = new LevelTransitionState();
