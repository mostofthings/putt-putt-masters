import { controls } from '@/core/controls';
import { createGameStateMachine, getGameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu-state';

createGameStateMachine(menuState);

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

  requestAnimationFrame(draw);
}
