import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";

export function createRegularGrass(width: number, length: number): Mesh {
  const geometry = new MoldableCubeGeometry(width, 2, length);
  return new Mesh(geometry, new Material({ color: '#092' }))
}
