import { State } from '@/core/state';
import { audioCtx, getAudioPlayer, panner } from '@/engine/audio/audio-player';
import { Skybox } from '@/skybox';
import { skyboxes,} from '@/texture-maker';
import { Scene } from '@/engine/renderer/scene';
import { Camera } from '@/engine/renderer/camera';
import { renderer } from '@/engine/renderer/renderer';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import { getGameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu-state';
import { ThirdPersonPlayer } from '@/third-person-player';
import {Level} from "@/game-states/levels/level";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

class GameState implements State {
  player: ThirdPersonPlayer;
  camera: Camera;
  scene: Scene;
  groupedFaces?: {floorFaces: Face[], wallFaces: Face[], ceilingFaces: Face[]};

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera(Math.PI / 3, 16 / 9, 1, 400);
    this.player = new ThirdPersonPlayer(this.camera)
  }

  onEnter(level: Level) {
    this.camera.position = level.cameraPosition;
    this.player.respawnCameraPosition.set(level.cameraPosition);
    this.player.respawnPoint.set(level.respawnPoint);

    this.player.respawn();

    const { scene, groupedFaces } = level.sceneCallback();
    this.scene = scene;
    this.groupedFaces = groupedFaces;

    const soundPlayer = getAudioPlayer();

    this.scene.skybox = new Skybox(...skyboxes.dayCloud);
    this.scene.skybox.bindGeometry();

    this.scene.add(this.player.mesh);

    const audio = soundPlayer(...[, , 925, .04, .3, .6, 1, .3, , 6.27, -184, .09, .17] as const);

    // audio.loop = true;
    audio.connect(panner).connect(audioCtx.destination);
    // audio.start();



// @ts-ignore

  }

  onUpdate(timeElapsed: number): void {
    this.player.update(this.groupedFaces!);

    // particle.lookAt(this.player.camera.position);
    // particle2.lookAt(this.player.camera.position);
    // particle.rotate(-1, 0, 0);
    // particle2.rotate(-1, 0, 0);

    this.scene.updateWorldMatrix();

    renderer.render(this.player.camera, this.scene);

    if (controls.isEscape) {
      getGameStateMachine().setState(menuState);
    }
  }
}

export const gameState = new GameState();
