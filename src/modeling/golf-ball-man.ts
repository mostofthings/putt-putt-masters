import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {Object3d} from "@/engine/renderer/object-3d";


export class GolfBallMan extends Mesh {
  legs: Object3d[]
  constructor() {
    super(  createGolfBallBody(),
      new Material({color: '#fff'}))
    this.legs = createLegs()
    this.add(...this.legs);
  }
}

function createLegs(): Object3d[] {
  const leftLeg = createLeg(-.1);
  const rightLeg = createLeg(.1);
  return [leftLeg, rightLeg];
}

function createGolfBallBody() {
  return new MoldableCubeGeometry(1,1,1, 4,4,4)
    .spherify(.5)
    .computeNormalsCrossPlane()
    .done()
}

function createLeg(xPosition: number): Object3d {
  const leg = makeLegSection();
  leg.position.set(xPosition, -.25,0);
  const hipJoint = new Object3d();
  hipJoint.position.set(xPosition, -.25, 0);
  hipJoint.add(leg);
  return hipJoint;
}

function makeLegSection() {
  const geometry = new MoldableCubeGeometry(.25,.75,.25,)
    .cylindrify(.125)
    .done()
  return new Mesh(geometry, new Material({color: 'black'}))
}

