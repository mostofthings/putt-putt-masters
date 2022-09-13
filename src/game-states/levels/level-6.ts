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
import {Material} from "@/engine/renderer/material";

// par 2
export function getLevel6() {
  const holePosition = new EnhancedDOMPoint(0,0,15);
  const respawnPoint = new EnhancedDOMPoint(0, -1, -20);
  const cameraPosition = new EnhancedDOMPoint(0,10,-25);

  const platforms = [createRegularGrass(10, 45)];
  platforms[0].position.set(0, -2, 0)
  doTimes(2, () => platforms.push(createRegularGrass(4, 40, 6)))
  platforms[1].position.set(-4, 2, -3);
  platforms[2].position.set(4, 2, -3);

  const material = new Material({color: '#092'});

  const movingPlatforms: MovingMesh[] = [];
  const movingSpikes: MovingMesh[] = [];

  doTimes(3, (index) => {
    const geometry = new MoldableCubeGeometry(5, 2, 5);
    const vector = new EnhancedDOMPoint(0,-.3, 0);
    const spikes = createSpikedGround(2.5, 2.5) as Mesh;
    movingPlatforms.push(new MovingMesh(geometry, material, vector,  7))
    movingSpikes.push(new MovingMesh(spikes.geometry as MoldableCubeGeometry, spikes.material, vector, 7));
    movingSpikes[index].add(...spikes.children);
    movingSpikes[index].isDeadly = true;
  })

  movingSpikes.forEach(spikes => {
    spikes.scale.set(1.9, 1, 1.9);
    spikes.rotate(degreesToRads(180), 0, 0);
  })

  movingPlatforms[0].position.set(0, 8, -10)
  movingSpikes[0].position.set(0, 7, -10)

  movingPlatforms[1].position.set(0, 8, -2)
  movingSpikes[1].position.set(0, 7, -2)

  movingPlatforms[2].position.set(0, 8, 9)
  movingSpikes[2].position.set(0, 7, 9)

  const staticMeshesToCollide = [...platforms ]

  return new Level(
    6,
    holePosition,
    respawnPoint,
    cameraPosition,
    [
      ...staticMeshesToCollide,
      ...movingPlatforms,
      ...movingSpikes,
    ],
    staticMeshesToCollide,
    [
      ...movingPlatforms,
      ...movingSpikes,
    ],
  )
}
