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
import {findFloorHeightAtPosition, findWallCollisionsFromList} from "@/engine/physics/surface-collision";
import {GroupedFaces} from "@/engine/grouped-faces";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {doTimes} from "@/engine/helpers";
import {GolfBallMan} from "@/modeling/golf-ball-man";

const debugElement = document.querySelector('#debug')!;

class GameState implements State {
  player: ThirdPersonPlayer;
  level!: Level;
  camera: Camera;
  deathCount: { [key: string]: number} = {};
  deadBodies: Mesh[] = [];

  constructor() {
    this.camera = new Camera(Math.PI / 3, 16 / 9, 1, 400);
    this.player = new ThirdPersonPlayer(this.camera);
    doTimes(150, () => this.deadBodies.push(new GolfBallMan()));
  }

  onEnter(levelCallback: LevelCallback) {
    this.level = levelCallback();
    this.camera.position = this.level.cameraPosition;
    this.player.respawnCameraPosition.set(this.level.cameraPosition);
    this.player.respawnPoint.set(this.level.respawnPoint);
    this.deathCount[this.level.levelNumber] = 0;

    this.deadBodies.forEach((man) => {
      man.position.x = 1000;
      this.level.scene.add(man);
    })

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
    // player collision call
    const collisionDepth = this.collideWithLevel(
      this.level.groupedFaces,
      this.player.feetCenter,
      this.player.collisionOffsetY,
      this.player.collisionRadius
    )
    this.player.updatePositionFromCollision(collisionDepth)

    debugElement.textContent = `
    feet x: ${ this.player.feetCenter.x }
    feet z: ${ this.player.feetCenter.z }
    death count: ${this.deathCount[this.level.levelNumber]}
    total Deaths: ${this.totalDeaths}
    dead body 0 pos: x ${ this.deadBodies[0].position.x } y ${ this.deadBodies[0].position.y } z ${this.deadBodies[0].position.z}
    `

    if (Math.abs(this.player.feetCenter.x) > 20 || Math.abs(this.player.feetCenter.z) > 20) {
      this.killPlayer();
    }

    this.level.scene.updateWorldMatrix();

    renderer.render(this.player.camera, this.level.scene);

    if (controls.isEscape) {
      getGameStateMachine().setState(menuState);
    }
  }

  collideWithLevel(
    groupedFaces: GroupedFaces,
    feetCenter: EnhancedDOMPoint,
    offsetY: number,
    radius: number,
    ): number | undefined {
    const wallCollisions = findWallCollisionsFromList(groupedFaces.wallFaces, feetCenter, offsetY, radius);
    feetCenter.x += wallCollisions.xPush;
    feetCenter.z += wallCollisions.zPush;

    const floorData = findFloorHeightAtPosition(groupedFaces!.floorFaces, feetCenter);

    if (!floorData) {
      return;
    }

    return floorData.height - feetCenter.y;
  }

  private killPlayer() {
    const levelNumber = this.level.levelNumber;
    this.deathCount[levelNumber] += 1;
    this.deadBodies[this.deathCount[levelNumber] - 1].position.set(this.player.feetCenter)
    this.deadBodies[this.deathCount[levelNumber] - 1].position.y += .5;
    this.player.respawn();
  }

  get totalDeaths() {
    return Object.values(this.deathCount).reduce((prev, current) => prev += current);
  }
}

export const gameState = new GameState();
