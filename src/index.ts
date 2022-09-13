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

const debugElement = document.querySelector('#debug')!;

// TESTING
drawCurrentTexture();
// END TESTING



createGameStateMachine(menuState);

// let lastTime = 0;
draw(0);


function draw(time: number) {
  controls.queryController();

  getGameStateMachine().getState().onUpdate(time);

  requestAnimationFrame(draw);
}
