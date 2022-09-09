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
import {isPlayer, ThirdPersonPlayer} from '@/third-person-player';
import {Level} from "@/game-states/levels/level";
import {LevelCallback} from "@/game-states/levels/level-callback";
import {findFloorHeightAtPosition, findWallCollisionsFromList} from "@/engine/physics/surface-collision";
import {GroupedFaces} from "@/engine/grouped-faces";
import {EnhancedDOMPoint, VectorLike} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {doTimes} from "@/engine/helpers";
import {createDeadBody, GolfBallMan} from "@/modeling/golf-ball-man";
import {degreesToRads, isPointInRadius, radsToDegrees} from "@/engine/math-helpers";
import {drawEngine} from "@/core/draw-engine";
import {pars} from "@/game-states/levels/pars";
import {scores} from "@/engine/scores";
import {levelTransitionState} from "@/game-states/level-transition-state";
import {Enemy, isEnemy} from "@/modeling/enemy";

const debugElement = document.querySelector('#debug')!;

class GameState implements State {
  player: ThirdPersonPlayer;
  level!: Level;
  camera: Camera;

  constructor() {
    this.camera = new Camera(Math.PI / 3, 16 / 9, 1, 400);
    this.player = new ThirdPersonPlayer(this.camera);
  }

  onEnter(levelCallback: LevelCallback) {
    this.level = levelCallback();
    this.camera.position = this.level.cameraPosition;
    this.player.respawnCameraPosition.set(this.level.cameraPosition);
    this.player.respawnPoint.set(this.level.respawnPoint);
    scores.setLevelScore(this.levelNumber, 1);

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
    this.player.update();
    // player collision call
    const collisionDepth = this.collideWithLevel(
      this.level.groupedFaces,
      this.player.feetCenter,
      this.player.collisionOffsetY,
      this.player.collisionRadius
    )
    this.player.updatePositionFromCollision(collisionDepth)

    this.level.enemies.forEach(enemy => enemy.update());

    // check player for collide with enemies; call onCollide
    this.collideWithEnemies(this.player, this.level.enemies)

    // check enemies for collide with each other and the player;
    this.level.enemies.forEach(enemy => this.collideWithEnemies(enemy, [...this.level.enemies, this.player]));

    if (isPointInRadius(this.player.feetCenter, this.level.holePosition, .8)) {
      getGameStateMachine().setState(levelTransitionState, this.levelNumber + 1)
    }

    this.level.scene.updateWorldMatrix();

    renderer.render(this.player.camera, this.level.scene);

    drawEngine.drawText(
      `Hole ${ this.levelNumber }
      Par ${ pars[this.levelNumber - 1]}
      Current Stroke: ${ scores.getLevelScore(this.levelNumber) + 1 }`
      , 25, 600,  30, 'white');

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

    const collisionDepth = floorData.height - feetCenter.y;

    if (floorData.floor.isDeadly && collisionDepth > 0) {
      this.killPlayer();
    }

    return collisionDepth;
  }


  collideWithEnemies(toCollide: ThirdPersonPlayer | Enemy, enemies: (Enemy | ThirdPersonPlayer)[]) {
    for (const enemy of enemies) {
      // can't collide with itself
      if (toCollide.feetCenter === enemy.feetCenter) {
        continue;
      }

      if (toCollide.feetCenter.y + toCollide.height < enemy.feetCenter.y) {
        continue;
      }

      if (toCollide.feetCenter.y > enemy.feetCenter.y + enemy.height) {
        continue;
      }

      const magnitude = Math.sqrt(Math.pow((enemy.feetCenter.x - toCollide.feetCenter.x), 2) + Math.pow((enemy.feetCenter.z - toCollide.feetCenter.z), 2));

      if (magnitude >= toCollide.collisionRadius + enemy.collisionRadius) {
        continue;
      }

      if (isPlayer(toCollide)) {
        if (isEnemy(enemy) && enemy.isDeadly) {
          this.killPlayer();
        }
      } else {
        toCollide.onCollide();
      }
    }
  }

  private killPlayer() {
    if (this.player.isDead) {
      return;
    }
    this.player.isDead = true;
    scores.setLevelScore(this.levelNumber, scores.getLevelScore(this.levelNumber) + 1);
    setTimeout(() => this.respawnPlayer(), 3000);
  }

  respawnPlayer() {
    const bodyToMove = this.level.deadBodies[scores.getLevelScore(this.levelNumber) - 1];
    bodyToMove.position.set(this.player.feetCenter)
    const floorFace = findFloorHeightAtPosition(this.level.groupedFaces.floorFaces, this.player.feetCenter);
    if (floorFace) {
      bodyToMove.position.y = floorFace.height + .7;
    }
    bodyToMove.updateWorldMatrix(); // this may be unnecessary
    this.level.updateGroupedFaces();
    this.player.respawn();
  }

  get levelNumber() {
    return this.level.levelNumber;
  }
}

export const gameState = new GameState();
