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
import {LevelCallback} from "@/game-states/levels/level-callback";

class GameState implements State {
  player: ThirdPersonPlayer;
  level!: Level;
  camera: Camera;

  constructor() {
    this.camera = new Camera(Math.PI / 3, 16 / 9, 1, 400);
    this.player = new ThirdPersonPlayer(this.camera)
  }

  onEnter(levelCallback: LevelCallback) {
    this.level = levelCallback();
    this.camera.position = this.level.cameraPosition;
    this.player.respawnCameraPosition.set(this.level.cameraPosition);
    this.player.respawnPoint.set(this.level.respawnPoint);

    this.player.respawn();

    const soundPlayer = getAudioPlayer();

    this.level.scene.skybox = new Skybox(...skyboxes.dayCloud);
    this.level.scene.skybox.bindGeometry();

    this.level.scene.add(this.player.mesh);

    const audio = soundPlayer(...[, , 925, .04, .3, .6, 1, .3, , 6.27, -184, .09, .17] as const);

    // audio.loop = true;
    audio.connect(panner).connect(audioCtx.destination);
    // audio.start();



// @ts-ignore

  }

  onUpdate(timeElapsed: number): void {
    this.player.update(this.level.groupedFaces!);

    // particle.lookAt(this.player.camera.position);
    // particle2.lookAt(this.player.camera.position);
    // particle.rotate(-1, 0, 0);
    // particle2.rotate(-1, 0, 0);

    this.level.scene.updateWorldMatrix();

    renderer.render(this.player.camera, this.level.scene);

    if (controls.isEscape) {
      getGameStateMachine().setState(menuState);
    }
  }
}

export const gameState = new GameState();
