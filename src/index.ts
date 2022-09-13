import { Camera } from './engine/renderer/camera';
import { Mesh } from './engine/renderer/mesh';
import { MoldableCubeGeometry } from './engine/moldable-cube-geometry';
import { Material } from './engine/renderer/material';
import { getGroupedFaces } from './engine/physics/parse-faces';
import { PlaneGeometry } from './engine/plane-geometry';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { AttributeLocation, Renderer } from "@/engine/renderer/renderer";
import {
  drawBricks,
  drawCurrentTexture,
  drawGrass,
  drawLandscape,
  drawMarble, drawParticle, drawSky,
  drawStoneWalkway, drawVolcanicRock, drawWater
} from '@/texture-maker';
import { controls } from '@/core/controls';
import { createGameStateMachine, getGameStateMachine } from '@/game-state-machine';
import { gameState } from '@/game-states/game-state';
import { menuState } from '@/game-states/menu-state';
import { getLevel1 } from '@/game-states/levels/level-1';
import { getLevel2 } from '@/game-states/levels/level-2';

const debugElement = document.querySelector('#debug')!;

// TESTING
drawCurrentTexture();
// END TESTING

createGameStateMachine(gameState, getLevel1);


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

  debugElement.textContent = delta.toString();

  requestAnimationFrame(draw);
}
