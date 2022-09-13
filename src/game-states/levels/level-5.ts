import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {doTimes} from "@/engine/helpers";
import {createSpikedGround} from "@/modeling/spiked-ground";
import {Mesh} from "@/engine/renderer/mesh";
import {ProximityMine} from "@/modeling/proximity-mine";
import {MovingMesh} from "@/modeling/MovingMesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {degreesToRads} from "@/engine/math-helpers";

// par 3
export function getLevel5() {
  const holePosition = new EnhancedDOMPoint(0,2,0);
  const respawnPoint = new EnhancedDOMPoint(0, 0, -17);
  const cameraPosition = new EnhancedDOMPoint(0,10,-20);

  const platforms = [createRegularGrass(40, 40), createRegularGrass(11, 11)];
  platforms[0].position.set(0, -2, 0)

  const spikes: Mesh = createSpikedGround(10, 10);
  spikes.scale.set(3, 1, 3);

  const singlePlatform = createRegularGrass(8, 8);
  const vector = new EnhancedDOMPoint(0,.2, 0);
  const movingPlatform = new MovingMesh(singlePlatform.geometry as MoldableCubeGeometry, singlePlatform.material, vector,  30);
  movingPlatform.position.set(-6, -2, -15);
  const spikesToMove = createSpikedGround(2, 2) as Mesh;
  const movingSpikes = new MovingMesh(spikesToMove.geometry as MoldableCubeGeometry, spikesToMove.material, vector, 30)
  movingSpikes.add(...spikesToMove.children);
  movingSpikes.isDeadly = true;

  movingSpikes.scale.set(3.8, 1, 3.8);
  movingSpikes.rotate(degreesToRads(180), 0, 0);
  movingSpikes.position.set(-6,-3,-15);



  const staticMeshesToCollide = [...platforms, spikes];

  return new Level(
    5,
    holePosition,
    respawnPoint,
    cameraPosition,
    [
      ...staticMeshesToCollide,
      movingPlatform,
      movingSpikes,
    ],
    staticMeshesToCollide,
    [
      movingPlatform,
      movingSpikes,
    ],
  )
}
