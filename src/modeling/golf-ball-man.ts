import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";


export class GolfBallMan extends Mesh {
  constructor() {
    super(  getBallBody(),
      new Material({color: '#fff'}))
  }

}

function getBallBody() {
  return new MoldableCubeGeometry(1,1,1, 4,4,4)
    .spherify(.5)
    .computeNormalsCrossPlane()
    .done()
}

