import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {createStartPlatform} from "@/modeling/tee-platform";
import {createSpikedGround} from "@/modeling/spiked-ground";
import {ProximityMine} from "@/modeling/proximity-mine";
import {Enemy} from "@/modeling/enemy";
import {MovingMesh} from "@/modeling/MovingMesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {degreesToRads} from "@/engine/math-helpers";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {materials} from "@/texture-maker";

// par 5
export function getLevel4() {
  const holePosition = new EnhancedDOMPoint(0,5.5,22);
  const respawnPoint = new EnhancedDOMPoint(0, 0, -18);
  const cameraPosition = new EnhancedDOMPoint(0,20,30);

  const ground = createRegularGrass(20, 50);
  ground.position.set(0,-2, 0);

  const holePlatform = createRegularGrass(8, 8);
  holePlatform.position.set(0, 4, 22)

  const movingPlatforms: MovingMesh[] = [];
  const movingSpikes: MovingMesh[] = [];

  doTimes(3, (index) =>{
    const geometry = new MoldableCubeGeometry(5, 2, 5);
    const vector = new EnhancedDOMPoint(0,0, .25);
    const spikes = createSpikedGround(2.5, 2.5) as Mesh;
    movingPlatforms.push(new MovingMesh(geometry, materials.grass, vector,  12))
    movingSpikes.push(new MovingMesh(spikes.geometry as MoldableCubeGeometry, spikes.material, vector, 12));
    movingSpikes[index].add(...spikes.children);
    movingSpikes[index].isDeadly = true;
  })

  movingSpikes.forEach(spikes => {
    spikes.scale.set(1.9, 1, 1.9);
    spikes.rotate(degreesToRads(180), 0, 0);
  })

  movingPlatforms[0].position.set(-3.5, 3,  -15);
  movingSpikes[0].position.set(-3.5, 2, -15);

  const oppositeDirectionVector = new EnhancedDOMPoint(0,0,-.25);
  movingPlatforms[1].movementVector = oppositeDirectionVector;
  movingSpikes[1].movementVector = oppositeDirectionVector;
  movingPlatforms[1].position.set(3.5, 3,  6);
  movingSpikes[1].position.set(3.5, 2, 6);

  movingPlatforms[2].position.set(-3.5, 3,  7);
  movingSpikes[2].position.set(-3.5, 2, 7);


  const staticMeshesToCollide = [ground, holePlatform];
  staticMeshesToCollide.forEach(object => object.updateWorldMatrix())


  return new Level(
    4,
    holePosition,
    respawnPoint,
    cameraPosition,
    [
      ...staticMeshesToCollide,
      ...movingPlatforms,
      ...movingSpikes,
      holePlatform,
    ],
    staticMeshesToCollide,
    [
      ...movingPlatforms,
      ...movingSpikes,
    ],
  )
}
