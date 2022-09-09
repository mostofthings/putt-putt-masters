import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import { Mesh } from '@/engine/renderer/mesh';
import { textureLoader } from '@/engine/renderer/texture-loader';
import { drawVolcanicRock } from '@/texture-maker';
import { audioCtx } from '@/engine/audio/audio-player';
import {GolfBallMan} from "@/modeling/golf-ball-man";
import {clamp, moveValueTowardsTarget} from "@/engine/helpers";

const debugElement = document.querySelector('#debug')!;


export class ThirdPersonPlayer {
  isJumping = false;
  canJumpAgain = true;
  feetCenter = new EnhancedDOMPoint(0, 0, 0);
  collisionOffsetY = .4;
  collisionRadius = .1
  respawnPoint = new EnhancedDOMPoint(0,0,0);
  respawnCameraPosition = new EnhancedDOMPoint(0,0,0);

  speed = 0;
  velocity = new EnhancedDOMPoint(0, 0, 0);
  speedCounter = 0;
  angle = 0;

  mesh: GolfBallMan;
  camera: Camera;
  idealPosition = new EnhancedDOMPoint(0, 3, -8);
  idealLookAt = new EnhancedDOMPoint(0, 2, 0);

  listener: AudioListener;


  constructor(camera: Camera) {
    textureLoader.load(drawVolcanicRock())
    this.mesh = new GolfBallMan();
    this.feetCenter.y = 10;
    this.camera = camera;
    this.listener = audioCtx.listener;
  }

  private transformIdeal(ideal: EnhancedDOMPoint): EnhancedDOMPoint {
    return new EnhancedDOMPoint()
      .set(this.mesh.rotationMatrix.transformPoint(ideal))
      .add(this.mesh.position);
  }

  update(groupedFaces: { floorFaces: Face[]; wallFaces: Face[] }) {
    this.updateVelocityFromControls();

    this.feetCenter.add(this.velocity);

    this.mesh.position.set(this.feetCenter);
    this.mesh.position.y += 1.25; // move up by half height so mesh ends at feet position


    this.moveAppendages();


    this.camera.position.lerp(this.transformIdeal(this.idealPosition), 0.01);

    // Keep camera away regardless of lerp
    const distanceToKeep = 17;
    const {x, z} = this.camera.position.clone()
      .subtract(this.mesh.position) // distance from camera to player
      .normalize() // direction of camera to player
      .scale(distanceToKeep) // scale direction out by distance, giving us a lerp direction but constant distance
      .add(this.mesh.position); // move back relative to player

    this.camera.position.x = x;
    this.camera.position.z = z;

    this.camera.lookAt(this.transformIdeal(this.idealLookAt));
    this.camera.updateWorldMatrix();

    this.updateAudio()
  }

  protected updateVelocityFromControls() {
    const speedMultiplier = 0.1;

    const mag = clamp(controls.direction.magnitude, 0, 1);
    const step = mag > this.speed ? .05 : .03;
    this.speed = moveValueTowardsTarget(this.speed, mag, step);

    const inputAngle = Math.atan2(-controls.direction.x, -controls.direction.z);
    const playerCameraDiff = this.mesh.position.clone().subtract(this.camera.position);
    const playerCameraAngle = Math.atan2(playerCameraDiff.x, playerCameraDiff.z);

    if (controls.direction.x !== 0 || controls.direction.z !== 0) {
      this.angle = inputAngle + playerCameraAngle;
    }

    this.velocity.z = Math.cos(this.angle) * this.speed * speedMultiplier;
    this.velocity.x = Math.sin(this.angle) * this.speed * speedMultiplier;

    this.mesh.setRotation(0, this.angle, 0);

    if (controls.isJumpPressed && this.canJumpAgain) {
      if (!this.isJumping) {
        this.velocity.y = 0.4;
        this.isJumping = true;
        this.canJumpAgain = false;
      }
    }
    if (!this.isJumping && !controls.isJumpPressed) {
      this.canJumpAgain = true;
    }
    this.velocity.y -= 0.025; // gravity
  }

  updatePositionFromCollision(collisionDepth?: number) {
    if (collisionDepth && collisionDepth > 0) {
      this.feetCenter.y += collisionDepth;
      this.velocity.y = 0;
      this.isJumping = false;
    }
  }

  private updateAudio() {
    this.listener.positionX.value = this.mesh.position.x;
    this.listener.positionY.value = this.mesh.position.y;
    this.listener.positionZ.value = this.mesh.position.z;

    const {x, z} = this.mesh.position.clone()
      .subtract(this.camera.position) // distance from camera to player
      .normalize() // direction of camera to player

    this.listener.forwardX.value = x;
    // this.listener.forwardY.value = cameraDireciton.y;
    this.listener.forwardZ.value = z;
  }

  respawn() {
    this.mesh.position.set(this.respawnPoint);
    this.mesh.position.y += 8;
    this.feetCenter.set(this.mesh.position);
    this.camera.position.set(this.respawnCameraPosition);
  }

  protected moveAppendages() {
    const rotateAmount = Math.sin(this.speedCounter) * .5 * this.speed;
    // no walking while jumping
    if (!this.isJumping) {
      this.speedCounter += this.speed * .5;
      this.mesh.legs[0].setRotation(rotateAmount, 0, 0);
      this.mesh.legs[1].setRotation(rotateAmount * -1,0, 0);
      this.mesh.legs[0].children[0].children[0].setRotation(rotateAmount * .5, 0,0)
      this.mesh.legs[1].children[0].children[0].setRotation(rotateAmount * -.5, 0 ,0)
    }
    this.mesh.arms[0].setRotation(rotateAmount * -1,0, 0);
    this.mesh.arms[1].setRotation(rotateAmount, 0, 0);

    // arms flap while jumping
    this.mesh.arms[0].children[0].setRotation(0,0, this.velocity.y * 4);
    this.mesh.arms[1].children[0].setRotation(0,0, this.velocity.y * -4);
  }
}
