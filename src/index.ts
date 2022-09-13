import {
  drawCurrentTexture,
} from '@/texture-maker';
import { controls } from '@/core/controls';
import { createGameStateMachine, getGameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu-state';
import {gameState} from "@/game-states/game-state";
import {getLevel4} from "@/game-states/levels/level-4";
import {getLevel2} from "@/game-states/levels/level-2";
import {getLevel5} from "@/game-states/levels/level-5";

const debugElement = document.querySelector('#debug')!;

// TESTING
drawCurrentTexture();
// END TESTING

// TODO: remove this
createGameStateMachine(gameState, getLevel2);


let previousTime = 0;
const interval = 1000 / 60;

draw(0);

function draw(currentTime: number) {
  controls.queryController();
  const delta = currentTime - previousTime;

  if (delta >= interval) {
    previousTime = currentTime - (delta % interval);

    getGameStateMachine().getState().onUpdate(delta);
  }

  // TODO: remove
  debugElement.textContent = delta.toString();

  requestAnimationFrame(draw);
}
