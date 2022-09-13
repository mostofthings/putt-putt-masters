import { State } from '@/core/state';
import {toggleMusic} from '@/engine/audio/audio-player';
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
import {
  findCeilingFromList,
  findFloorHeightAtPosition,
  findWallCollisionsFromList
} from "@/engine/physics/surface-collision";
import {GroupedFaces} from "@/engine/grouped-faces";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {areCylindersColliding} from "@/engine/math-helpers";
import {drawEngine} from "@/core/draw-engine";
import {pars} from "@/game-states/levels/pars";
import {scores} from "@/engine/scores";
import {levelTransitionState} from "@/game-states/level-transition-state";
import {Enemy} from "@/modeling/enemy";
import {MovingMesh} from "@/modeling/MovingMesh";
import {CollisionCylinder} from "@/modeling/collision-cylinder";
import {Mesh} from "@/engine/renderer/mesh";

class GameState implements State {
  player: ThirdPersonPlayer;
  level!: Level;
  camera: Camera;
  isMusicKeyPressed = false;

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
    this.player.isCameraFollowing = false;

    this.player.respawn();

    window.setTimeout(() => this.player.isCameraFollowing = true, 4000);

    this.level.scene.skybox = new Skybox(...skyboxes.dayCloud);
    this.level.scene.skybox.bindGeometry();

    this.level.scene.add(this.player.mesh);
  }

  onUpdate(timeElapsed: number): void {
    // move any platform or anything that's supposed to move
    this.level.updateDynamicMeshPosition()

    this.player.update();
    // player collision call
    const collisionDepth = this.collideWithLevel(this.level.groupedFaces, this.player)
    this.player.updatePositionFromCollision(collisionDepth)

    // remove dead enemies
    this.removeStaleEnemiesFromScene();

    // update remaining enemies
    this.level.enemies.forEach(enemy => {
      if (enemy && typeof enemy.update === 'function') {
        enemy.update();
      }
    });

    // check player for collide with enemies; call onCollide
    this.collideWithEnemies(this.player, this.level.enemies)

    // check enemies for collide with each other and the player;
    // this.level.enemies.forEach(enemy => this.collideWithEnemies(enemy, [...this.level.enemies, this.player]));

    if (areCylindersColliding(this.level.hole, this.player)) {
      this.player.velocity.set(0,0,0);
      getGameStateMachine().setState(levelTransitionState, this.levelNumber + 1)
    }

    if (!this.player.isCameraFollowing) {
      this.camera.lookAt(this.level.hole.position);
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

    if (controls.isM && !this.isMusicKeyPressed) {
      toggleMusic();
    }
    this.isMusicKeyPressed = controls.isM;
  }

  collideWithLevel(
    groupedFaces: GroupedFaces,
    collisionCylinder: CollisionCylinder & { velocity?: EnhancedDOMPoint },
    ): number | undefined {
    const { feetCenter, height, collisionRadius } = collisionCylinder;
    const wallCollisions = findWallCollisionsFromList(groupedFaces.wallFaces, feetCenter, height, collisionRadius);
    feetCenter.x += wallCollisions.xPush;
    feetCenter.z += wallCollisions.zPush;

    const ceilingAtPoint = findCeilingFromList(groupedFaces.ceilingFaces, feetCenter, height)

    if (ceilingAtPoint && feetCenter.y + (height /2) < ceilingAtPoint.height && feetCenter.y + height > ceilingAtPoint.height) {
      const ceilingCollisionDepth = feetCenter.y + height - ceilingAtPoint.height

      if (collisionCylinder.velocity) {
        collisionCylinder.velocity.y = 0;
      }
      if (ceilingAtPoint.ceiling.isDeadly) {
        this.killPlayer(true, ceilingAtPoint.ceiling.parentMesh);
      }
    }

    const floorData = findFloorHeightAtPosition(groupedFaces!.floorFaces, feetCenter);

    if (!floorData) {
      return;
    }

    const collisionDepth = floorData.height - feetCenter.y;
    const parentMesh = floorData.floor.parentMesh;

    /// floor glue logic
    if (parentMesh && collisionDepth >= 0) {
      if (parentMesh.isIncrease) {
        this.player.mesh.position.add(parentMesh.movementVector)
        this.player.feetCenter.add(parentMesh.movementVector);
      } else {
        this.player.mesh.position.subtract(parentMesh.movementVector);
        this.player.feetCenter.subtract(parentMesh.movementVector)
      }
    }

    if (floorData.floor.isDeadly && collisionDepth > 0) {
      this.killPlayer(true, parentMesh, true);
    }

    return collisionDepth;
  }

  removeStaleEnemiesFromScene() {
    this.level.enemies.filter(enemy => enemy.shouldBeRemovedFromScene)
      .forEach((enemy) => this.level.scene.remove(enemy));
    this.level.enemies = this.level.enemies.filter(enemy => !enemy.shouldBeRemovedFromScene);
  }


  collideWithEnemies(toCollide: ThirdPersonPlayer, enemies: (Enemy)[]) {
    for (const enemy of enemies) {
      // can't collide with itself
      if (toCollide.feetCenter === enemy.feetCenter) {
        continue;
      }

      if (!areCylindersColliding(toCollide, enemy)) {
        continue;
      }

        if (enemy.isDeadly) {
          this.killPlayer();
        }


        if (typeof enemy.onCollide === 'function') {
          enemy.onCollide();
        }
    }
  }

  private killPlayer(shouldShowDeadBody: boolean = true, parentMesh?: MovingMesh, isFloorDeath: boolean = false) {
    // you can only die once 🤵
    if (this.player.isDead) {
      return;
    }

    if (shouldShowDeadBody){
      const bodyToMove = this.level.deadBodies[scores.getLevelScore(this.levelNumber) - 1];
      const collisionMeshToMove = this.level.deadBodyCollisionMeshes[scores.getLevelScore(this.levelNumber) - 1];
      bodyToMove.position.set(this.player.feetCenter);
      collisionMeshToMove.position.set(this.player.feetCenter);
      collisionMeshToMove.updateWorldMatrix();
      const floorFace = findFloorHeightAtPosition(this.level.groupedFaces.floorFaces, this.player.feetCenter);
      if (floorFace && isFloorDeath) {
        bodyToMove.position.y = floorFace.height + .7;
        collisionMeshToMove.position.y = floorFace.height + .7;
        this.level.dynamicMeshesToCollide.push(bodyToMove);
        this.level.deadBodyCollisionMeshes.push(collisionMeshToMove);
      } else {
        bodyToMove.position.y += .7;
        collisionMeshToMove.position.y += .7;
      }
      if (parentMesh) {
        parentMesh.otherMeshesToMove.push(bodyToMove);
        parentMesh.otherMeshesToMove.push(collisionMeshToMove);
        parentMesh.movementVector.x -= parentMesh.movementVector.x * .4
        parentMesh.movementVector.y -= parentMesh.movementVector.y * .4
        parentMesh.movementVector.z -= parentMesh.movementVector.z * .4
      }
      bodyToMove.updateWorldMatrix(); // this may be unnecessary
    }

    this.player.isDead = true;
    this.player.mesh.scale.set(0, 0, 0);

    scores.setLevelScore(this.levelNumber, scores.getLevelScore(this.levelNumber) + 1);
    setTimeout(() => this.respawnPlayer(), 3000);
  }

  respawnPlayer() {
    this.level.updateAllGroupedFaces();
    this.player.respawn();
    this.player.mesh.scale.set(1,1,1);
  }

  drawHUD() {
    const halfWidth = drawEngine.width / 2;
    const halfHeight = drawEngine.height / 2;

    drawEngine.clearContext();

    drawEngine.drawText(
      `Hole ${ this.levelNumber }
      Par ${ pars[this.levelNumber - 1]}
      Current Stroke: ${ scores.getLevelScore(this.levelNumber) }
      -- Press M for Music --`
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
