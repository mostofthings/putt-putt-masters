import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";

export function createSpike(radius: number, height: number): MoldableCubeGeometry {
  return new MoldableCubeGeometry(radius * 2, height, radius * 2,3,1,3)
    .cylindrify(radius)
    .selectBy(vertex => vertex.y > 0)
    .scale(0,1,0)
    .computeNormalsCrossPlane()
    .all()
    .done();
}
