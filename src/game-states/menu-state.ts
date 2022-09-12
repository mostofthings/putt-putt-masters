import { Scene } from '@/engine/renderer/scene';
import { State } from '@/core/state';
import { Skybox } from '@/skybox';
import { materials, skyboxes } from '@/texture-maker';
import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { renderer } from '@/engine/renderer/renderer';
import { controls } from '@/core/controls';
import { getGameStateMachine } from '@/game-state-machine';
import {drawEngine} from "@/core/draw-engine";
import {pars} from "@/game-states/levels/pars";
import {scores} from "@/engine/scores";
import {levelTransitionState} from "@/game-states/level-transition-state";

class MenuState implements State {
  scene: Scene;
  camera: Camera;
  selectedOptionIndex = 0;
  options: string[] = [];
  isNavigationKeyPressed = false;

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera(Math.PI / 5, 16 / 9, 1, 400);
  }

  onEnter() {
    const skybox = new Skybox(materials.marble.texture!.source,
      materials.marble.texture!.source,
      materials.marble.texture!.source,
      materials.marble.texture!.source,
      materials.marble.texture!.source,
      materials.marble.texture!.source,
    );
    skybox.bindGeometry();
    this.scene.skybox = skybox;
    this.camera.position = new EnhancedDOMPoint(0, 0, -17);

    this.options = ['New Game'];
    if (scores.scorecard && !scores.isScorecardComplete) {
      this.options.push('Resume');
    }
  }

  onUpdate() {
    drawEngine.clearContext();
    this.scene.updateWorldMatrix();

    renderer.render(this.camera, this.scene);

    if (!this.isNavigationKeyPressed) {
      if (controls.isUp && this.selectedOptionIndex !== 0) {
        this.selectedOptionIndex -= 1;
      }

      if (controls.isDown && this.selectedOptionIndex < this.options.length - 1) {
        this.selectedOptionIndex += 1;
      }
    }

    this.isNavigationKeyPressed = controls.isDown || controls.isUp;

    this.drawMenu();

    if (controls.isEnter) {
      switch (this.selectedOptionIndex) {
        case 0:
          scores.resetScores(pars);
          getGameStateMachine().setState(levelTransitionState, 1);
          break;
        case 1:
          const nextHole = scores.nextIncompleteHole;
          scores.setLevelScore(nextHole, -1);
          getGameStateMachine().setState(levelTransitionState, nextHole)
      }
    }
  }

  onLeave() {
    drawEngine.clearContext();
  }

  drawMenu() {
    const halfWidth = drawEngine.width / 2;
    drawEngine.drawText('Regular Golf', 85, halfWidth, 300)
    this.options.forEach((option, index) => {
      drawEngine.drawText(option, 50, halfWidth, (index * 55) + 500, index === this.selectedOptionIndex ? 'blue' : 'white');
    })
  }
}

export const menuState = new MenuState();
