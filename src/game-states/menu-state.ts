import { Scene } from '@/engine/renderer/scene';
import { State } from '@/core/state';
import { Skybox } from '@/skybox';
import { materials, skyboxes } from '@/texture-maker';
import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { renderer } from '@/engine/renderer/renderer';
import { controls } from '@/core/controls';
import { getGameStateMachine } from '@/game-state-machine';
import { gameState } from '@/game-states/game-state';
import {drawEngine} from "@/core/draw-engine";
import {getLevel3} from "@/game-states/levels/level-3";
import {getLevel2} from "@/game-states/levels/level-2";
import {LevelCallback} from "@/game-states/levels/level-callback";
import {pars} from "@/game-states/levels/pars";
import {scores} from "@/engine/scores";
import {levelTransitionState} from "@/game-states/level-transition-state";

class MenuState implements State {
  scene: Scene;
  camera: Camera;
  selectedOptionIndex = 0;
  options = ['New Game', 'Resume'];
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
  }

  onUpdate() {
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

    this.options.forEach((option, index) => {
      drawEngine.drawText(option, 75, 500, (index * 85) + 300, index === this.selectedOptionIndex ? 'blue' : 'white');
    })

    if (controls.isEnter) {
      switch (this.selectedOptionIndex) {
        case 0:
          scores.resetScore(pars);
          getGameStateMachine().setState(levelTransitionState, 1);
          break;
      }
    }
  }

  onLeave() {
    drawEngine.context.clearRect(0,0,drawEngine.width, drawEngine.height);
  }
}

export const menuState = new MenuState();
