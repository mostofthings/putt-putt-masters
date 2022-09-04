import {Mesh} from "@/engine/renderer/mesh";
import {createBox} from "@/modeling/building-blocks";
import {Material} from "@/engine/renderer/material";

export function getHole(): Mesh {
  const geometry = createBox(6, 2, 1, 6, 1, 1)
    .selectBy(vertex => Math.abs(vertex.x) < 2.5 && Math.abs(vertex.z) < 2.5)
    .cylindrify(1.5, 'y')
    .invertSelection()
    .cylindrify(3.5, 'y')
    .all()
    .computeNormalsCrossPlane()
    .done();

  return new Mesh(geometry, new Material({color: '#333'}));
}
