import {Mesh} from "@/engine/renderer/mesh";
import {doTimes} from "@/engine/helpers";
import {Object3d} from "@/engine/renderer/object-3d";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";
import {createSpike} from "@/modeling/spike";

const spikeBaseSize = .5;

export function createSpikedGround(width: number, length: number): Mesh {
  const numberOfSpikesX = getNumberOfSpikesPerDimension(width);
  const numberOfSpikesY = getNumberOfSpikesPerDimension(length);
  const spikeWidth = width / numberOfSpikesX;
  const spikeLength = length / numberOfSpikesY;
  const spikeBase = new Mesh(
    new MoldableCubeGeometry(width, .25, length),
    new Material({color: 'black'}),
    true,
  );

  const spikes: MoldableCubeGeometry[] = [];
  const startWidth = width / 2 * -1;
  const startLength = length / 2 * -1;

  doTimes(numberOfSpikesX, (widthIndex) => {
    doTimes(numberOfSpikesY, (lengthIndex) => {
      // spike geometry should be merged into one Mesh
      const newSpike = createSpike(spikeWidth / 2, spikeBaseSize);
      newSpike.translate(
        (spikeWidth / 2) + widthIndex * spikeWidth + startWidth,
        spikeBaseSize / 2,
        (spikeLength / 2) + lengthIndex * spikeLength + startLength,
        )
      spikes.push(newSpike)
    })
  })

  const mergedSpikes = spikes.reduce((prev, current) => {
    return prev.merge(current).done();
  });

  const spikeMesh = new Mesh(mergedSpikes, new Material({color: '#666'}))

  spikeBase.add(spikeMesh);
  return spikeBase;
}


function getNumberOfSpikesPerDimension(dimensionLength: number): number {
  return Math.round(dimensionLength / spikeBaseSize);
}
