import { State } from '@/core/state';
import { audioCtx, getAudioPlayer, panner } from '@/engine/audio/audio-player';
import { Skybox } from '@/skybox';
import { skyboxes,} from '@/texture-maker';
import { Camera } from '@/engine/renderer/camera';
import { renderer } from '@/engine/renderer/renderer';
import { controls } from '@/core/controls';
import { getGameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu-state';
import {isPlayer, ThirdPersonPlayer} from '@/third-person-player';
import {Level} from "@/game-states/levels/level";
import {LevelCallback} from "@/game-states/levels/level-callback";
import {findFloorHeightAtPosition, findWallCollisionsFromList} from "@/engine/physics/surface-collision";
import {GroupedFaces} from "@/engine/grouped-faces";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {areCylindersColliding} from "@/engine/math-helpers";
import {drawEngine} from "@/core/draw-engine";
import {pars} from "@/game-states/levels/pars";
import {scores} from "@/engine/scores";
import {levelTransitionState} from "@/game-states/level-transition-state";
import {Enemy, isEnemy} from "@/modeling/enemy";
import {MovingMesh} from "@/modeling/MovingMesh";

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
  }

  onUpdate(timeElapsed: number): void {
    // move any platform or anything that's supposed to move
    if (this.level.movingMeshes.length) {
      this.level.movingMeshes.forEach(movingMesh => movingMesh.update());
    }

    this.player.update();
    // player collision call
    const collisionDepth = this.collideWithLevel(
      this.level.groupedFaces,
      this.player.feetCenter,
      this.player.collisionOffsetY,
      this.player.collisionRadius
    )
    this.player.updatePositionFromCollision(collisionDepth)

    // remove dead enemies
    this.removeStaleEnemiesFromScene();

    // update remaining enemies
    this.level.enemies.forEach(enemy => enemy.update());

    // check player for collide with enemies; call onCollide
    this.collideWithEnemies(this.player, this.level.enemies)

    // check enemies for collide with each other and the player;
    this.level.enemies.forEach(enemy => this.collideWithEnemies(enemy, [...this.level.enemies, this.player]));

    if (areCylindersColliding(this.level.hole, this.player)) {
      getGameStateMachine().setState(levelTransitionState, this.levelNumber + 1)
    }

    if (this.player.feetCenter.y < -30 ) {
      this.killPlayer(false);
    }

    this.drawHUD();

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

    const collisionDepth = floorData.height - feetCenter.y;

    if (floorData.floor.isDeadly && collisionDepth > 0) {
      this.killPlayer();
    }

    return collisionDepth;
  }

  removeStaleEnemiesFromScene() {
    this.level.enemies.filter(enemy => enemy.shouldBeRemovedFromScene)
      .forEach((enemy) => this.level.scene.remove(enemy));
    this.level.enemies = this.level.enemies.filter(enemy => !enemy.shouldBeRemovedFromScene);
  }


  collideWithEnemies(toCollide: ThirdPersonPlayer | Enemy, enemies: (Enemy | ThirdPersonPlayer)[]) {
    for (const enemy of enemies) {
      // can't collide with itself
      if (toCollide.feetCenter === enemy.feetCenter) {
        continue;
      }

      if (!areCylindersColliding(toCollide, enemy)) {
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

  private killPlayer(shouldShowDeadBody: boolean = true) {
    // you can only die once 🤵
    if (this.player.isDead) {
      return;
    }
    this.player.isDead = true;
    scores.setLevelScore(this.levelNumber, scores.getLevelScore(this.levelNumber) + 1);
    setTimeout(() => this.respawnPlayer(shouldShowDeadBody), 3000);
  }

  respawnPlayer(shouldShowDeadBody: boolean) {
    if (shouldShowDeadBody){
      const bodyToMove = this.level.deadBodies[scores.getLevelScore(this.levelNumber) - 1];
      bodyToMove.position.set(this.player.feetCenter)
      const floorFace = findFloorHeightAtPosition(this.level.groupedFaces.floorFaces, this.player.feetCenter);
      if (floorFace) {
        bodyToMove.position.y = floorFace.height + .7;
      }
      bodyToMove.updateWorldMatrix(); // this may be unnecessary
    }

    this.level.updateGroupedFaces();
    this.player.respawn();
  }

  drawHUD() {
    const halfWidth = drawEngine.width / 2;
    const halfHeight = drawEngine.height / 2;

    drawEngine.clearContext();

    drawEngine.drawText(
      `Hole ${ this.levelNumber }
      Par ${ pars[this.levelNumber - 1]}
      Current Stroke: ${ scores.getLevelScore(this.levelNumber) }`
      , 25, halfWidth,  30);


    if (this.player.isDead) {
      drawEngine.drawText(`You Died`, 40, halfWidth, halfHeight);
      drawEngine.drawText(`Plus one stroke`, 20, halfWidth, halfHeight + 25);
    }
  }

  get levelNumber() {
    return this.level.levelNumber;
  }
}

export const gameState = new GameState();
