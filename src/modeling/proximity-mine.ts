import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {degreesToRads, radsToDegrees} from "@/engine/math-helpers";

export function createProximityMine(): Mesh {
  const bodyGeometry = new MoldableCubeGeometry(1.5,1,1.5,4,1,4)
    .cylindrify(.75)
    .done();
  const mineBody = new Mesh(bodyGeometry, new Material({color: '#666'}))
  const spikes: Mesh[] = [];
  doTimes(8, (index) => {
    const spike = createSpike();
    const degreesToRotate = 45 * index;
    spike.setRotation(degreesToRads(90), degreesToRads(degreesToRotate), 0)
    spikes.push(spike);
  })
  spikes[2].position.set(1, 0, 0);
  spikes[1].position.set(0.7,0,.7);
  spikes[0].position.set(0, 0,1);
  spikes[7].position.set(-0.7,0,0.7);
  spikes[6].position.set(-1,0,0);
  spikes[5].position.set(-.7,0,-.7);
  spikes[4].position.set(0,0,-1);
  spikes[3].position.set(.7,0,-.7);
  spikes.forEach(spike => mineBody.add(spike))
  return mineBody;
}

function createSpike(): Mesh {
  const spikeGeometry = new MoldableCubeGeometry(.5,.5,.5,3,1,3)
    .cylindrify(.25)
    .selectBy(vertex => vertex.y > 0)
    .scale(0,1,0)
    .computeNormalsCrossPlane()
    .done();
  return new Mesh(spikeGeometry, new Material({color: '#777'}))
}
