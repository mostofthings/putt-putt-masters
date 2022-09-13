import {Mesh} from "@/engine/renderer/mesh";
import {createBox} from "@/modeling/building-blocks";
import {Material} from "@/engine/renderer/material";
import {EnhancedDOMPoint, VectorLike} from "@/engine/enhanced-dom-point";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {CollisionCylinder} from "@/modeling/collision-cylinder";
import {materials} from "@/texture-maker";

export class Hole extends Mesh implements CollisionCylinder {
  feetCenter = new EnhancedDOMPoint()
  collisionRadius = 1.5
  height = .5

  constructor(position: VectorLike) {
    const geometry = createBox(6, 2, 1, 6, 1, 1)
      .selectBy(vertex => Math.abs(vertex.x) < 2.5 && Math.abs(vertex.z) < 2.5)
      .cylindrify(1.5, 'y')
      .all()
      .computeNormalsPerPlane()
      .done();

    super(geometry, materials.grass);
    this.position.set(position);
    this.feetCenter.set(position);
    // hole has height of 2
    this.feetCenter.y -= 1

    const flagPoleGeometry = new MoldableCubeGeometry(3,3,3,3,3,6)
      .cylindrify(1.5)
      .scale(.05, 2, .05)
      .translate(0, 3, 0)
      .done();

    const flagPole = new Mesh(flagPoleGeometry, new Material({color: 'black'}))

    const flagGeometry = new MoldableCubeGeometry(1,1,1)
      .scale(1.2, 1.2, .2)
      .selectBy(vertex => vertex.x < 0)
      .scale(1, 0, .1)
      .all()
      .translate(-.5, 5.8, 0)
      .done()

    flagPole.add(new Mesh(flagGeometry, new Material({color: 'red'})))
    this.add(flagPole);
  }
}
