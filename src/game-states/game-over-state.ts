import { Scene } from '@/engine/renderer/scene';
import { State } from '@/core/state';
import { Camera } from '@/engine/renderer/camera';
import {drawEngine} from "@/core/draw-engine";
import {Skybox} from "@/skybox";
import {materials} from "@/texture-maker";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {scores} from "@/engine/scores";

class GameOverState implements State {
  scene: Scene;
  camera: Camera;

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
    drawEngine.clearContext();
    drawEngine.drawText(`Game Over!`, 50, drawEngine.width / 2, 500);
    scores.drawScorecard();
  }

  onLeave() {
    drawEngine.clearContext();
  }
}

export const gameOverState = new GameOverState();
