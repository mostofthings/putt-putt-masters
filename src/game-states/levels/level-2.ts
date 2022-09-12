import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {createSpikedGround} from "@/modeling/spiked-ground";
import {doTimes} from "@/engine/helpers";
import {Mesh} from "@/engine/renderer/mesh";
import {degreesToRads} from "@/engine/math-helpers";
import {ProximityMine} from "@/modeling/proximity-mine";
import {Enemy} from "@/modeling/enemy";

// par 4
export function getLevel2() {
  const holePosition = new EnhancedDOMPoint(0,-.5,12);
  const respawnPoint = new EnhancedDOMPoint(0, -1, 0);
  const cameraPosition = new EnhancedDOMPoint(0,5,-20);

  const platforms = [createRegularGrass(10, 10), createRegularGrass(7, 12)];

  doTimes(6,() => platforms.push(createRegularGrass(5,5)));


  platforms[0].position.set(0,-2, 0);
  platforms[1].position.set(0,-2, 15)
  platforms[2].position.set(-8, 0, 4);
  platforms[3].position.set(8, 0, 4);
  platforms[4].position.set(-10, .5, 10);
  platforms[5].position.set(10, .5, 10);
  platforms[6].position.set(-8, .7, 16);
  platforms[7].position.set(8, .8, 16);

  const spikes: Mesh[] = [];
  doTimes(3, () => {spikes.push(createSpikedGround(5, .55)); })
  spikes[0].position.set(8, 1.1, 4)
  spikes[1].position.set(9, 1.6,10)
  spikes[2].position.set(8, 1.8, 16)

  const mines = [
    new ProximityMine(-8, 1.5, 4),
    new ProximityMine(-9, 2, 10),
    new ProximityMine(-8, 2.3, 16),
  ];

  const enemies = mines.flatMap(mine => [mine, mine.explosion]);

  const staticMeshesToCollide = [...platforms, ...spikes, ...mines];

  return new Level(
    2,
    holePosition,
    respawnPoint,
    cameraPosition,
    [...staticMeshesToCollide, ...enemies],
    staticMeshesToCollide,
    undefined,
    enemies
  )
}
