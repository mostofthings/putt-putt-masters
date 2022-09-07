import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {Object3d} from "@/engine/renderer/object-3d";


export class GolfBallMan extends Mesh {
  legs: Object3d[];
  arms: Object3d[];

  constructor() {
    super(  createGolfBallBody(),
      new Material({color: '#fff'}))
    this.legs = createLegs();
    this.add(...this.legs);
    const face = createFace();
    this.add(face);
    this.arms = createArms();
    this.add(...this.arms);
  }
}

function createGolfBallBody() {
  return new MoldableCubeGeometry(1,1,1, 4,4,4)
    .spherify(.5)
    .computeNormalsCrossPlane()
    .done()
}

function createFace() {
  const face = new Object3d();
  const leftEye = createEye(-.2)
  const righteye = createEye(.2)
  face.add(leftEye, righteye);
  const mouthGeometry = new MoldableCubeGeometry(.5,.1,.2)
    .translate(0, -.1, .4)
    .done()
  face.add(new Mesh(mouthGeometry, new Material({ color: 'black' })))
  return face;
}

function createEye(xPosition: number) {
  const geometry = new MoldableCubeGeometry(1,1,1)
    .spherify(.5)
    .scale(.2, .2, .2)
    .translate(xPosition, .25, .35)
    .done()
  return new Mesh(geometry, new Material({color: 'black'}))
}

function createLegs(): Object3d[] {
  const leftLeg = createLeg(-.1);
  const rightLeg = createLeg(.1);
  return [leftLeg, rightLeg];
}

function createLeg(xPosition: number): Object3d {
  const calf = createLimbSection();
  const kneeJoint = new Object3d();
  kneeJoint.position.set(0, -.4, 0);
  kneeJoint.add(calf);

  const thigh = createLimbSection();
  thigh.position.set(xPosition, -.25,0);
  const hipJoint = new Object3d();
  hipJoint.position.set(xPosition, -.25, 0);
  hipJoint.add(thigh);

  thigh.add(kneeJoint);
  return hipJoint;
}

function createArms(): Object3d[] {
  const leftArm = createArm(-.4, -.7);
  // leftArm.setRotation(0,0, -.75)
  const rightArm = createArm(.4, .7);
  // rightArm.setRotation(0,0,.75)
  return [leftArm, rightArm];
}


function createArm(xPosition: number, zRotation: number): Object3d {
  const arm = createLimbSection();

  const shoulderJoint = new Object3d();
  shoulderJoint.position.set(xPosition, -.25, 0);
  const armWrapper = new Object3d()
  arm.setRotation(0,0,zRotation)
  arm.position.set(Math.sign(xPosition) * .175,-.175,0)
  armWrapper.add(arm);
  shoulderJoint.add(armWrapper);
  return shoulderJoint;
}

function createLimbSection() {
  const geometry = new MoldableCubeGeometry(.25,.5,.25,)
    .cylindrify(.125)
    .done()
  return new Mesh(geometry, new Material({color: 'black'}))
}

