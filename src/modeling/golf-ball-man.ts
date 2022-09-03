import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";


export class GolfBallMan extends Mesh {
  constructor() {
    super(  new MoldableCubeGeometry(0.3, 1, 0.3),
      new Material({color: '#fff'}))
  }
}

