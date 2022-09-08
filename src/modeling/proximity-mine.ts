import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {degreesToRads} from "@/engine/math-helpers";
import {createSpike} from "@/modeling/spike";
import {Object3d} from "@/engine/renderer/object-3d";

export function createProximityMine(): Object3d {
  const bodyRadius = .75
  const bodyGeometry = new MoldableCubeGeometry(2 * bodyRadius,1,1.5,4,1,4)
    .cylindrify(bodyRadius)

  doTimes(8, (index) => {
    const spike = createSpike(.25, 1);
    const spikeDirection = degreesToRads(45 * index);
    spike.rotate(degreesToRads(90), spikeDirection, 0);
    spike.translate(Math.sin(spikeDirection), 0, Math.cos(spikeDirection));
    bodyGeometry.merge(spike);
  })
  bodyGeometry.done();
  return  new Mesh(bodyGeometry, new Material({color: '#666'}))
}
