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

  const spikes: Mesh[] = [];
  const startWidth = width / 2 * -1;
  const startLength = length / 2 * -1;

  doTimes(numberOfSpikesX, (widthIndex) => {
    doTimes(numberOfSpikesY, (lengthIndex) => {
      // spike geometry should be merged into one Mesh
      const newSpike = new Mesh(createSpike(spikeWidth / 2, spikeBaseSize), new Material({color: '#666'}));
      newSpike.position.set(
        (spikeWidth / 2) + widthIndex * spikeWidth + startWidth,
        spikeBaseSize / 2,
        (spikeLength / 2) + lengthIndex * spikeLength + startLength,
        )
      newSpike.isDeadly = true;
      spikes.push(newSpike)
    })
  })
  spikeBase.add(...spikes);
  return spikeBase;
}


function getNumberOfSpikesPerDimension(dimensionLength: number): number {
  return Math.round(dimensionLength / spikeBaseSize);
}
