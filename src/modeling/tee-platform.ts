import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {VectorLike} from "@/engine/enhanced-dom-point";

export function createStartPlatform(position: VectorLike) {
  const platformGeometry = new MoldableCubeGeometry(4, 1, 4);
  const platform = new Mesh(platformGeometry, new Material({ color: '#0D3'}))
  const divots: Mesh[] = [];
  doTimes(3, ()=> {
    const divotGeometry = new MoldableCubeGeometry(1,1,1, 4, 1, 4)
      .cylindrify(.5)
      .scale(.3, .1, .3)
      .done();
    divots.push(new Mesh(divotGeometry, new Material({color: '#555'})));
  })
  const height = .60
  divots[0].position.set(-1, height, 0);
  divots[1].position.set(0, height, 0);
  divots[2].position.set(1, height, 0);
  platform.add(...divots);
  platform.position.set(position);
  return platform;
}
