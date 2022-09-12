import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {doTimes} from "@/engine/helpers";
import {createSpikedGround} from "@/modeling/spiked-ground";
import {Mesh} from "@/engine/renderer/mesh";
import {ProximityMine} from "@/modeling/proximity-mine";

// par 3
export function getLevel3() {
  const holePosition = new EnhancedDOMPoint(0,16,20);
  const respawnPoint = new EnhancedDOMPoint(0, 0, -25);
  const cameraPosition = new EnhancedDOMPoint(0,5,-30);

  const platforms = [createRegularGrass(40, 50)];

  const spikes: Mesh[] = []

  const mine = new ProximityMine(2,7, -6);

  doTimes(9, () => platforms.push(createRegularGrass(5,5)));
  doTimes(3, () => spikes.push(createSpikedGround(7, 7)));
  // level base
  platforms[0].position.set(0,-1,-4);

  // spiked platform
  spikes[0].position.set(-5, 1, -20)
  platforms[1].position.set(-5, 1, -20)

  // spiked platform
  spikes[1].position.set(-7, 2, -13)
  platforms[2].position.set(-7, 2, -13)

  // no spikes
  platforms[3].position.set(-3, 4, -10)

  // no spikes but has a bomb
  platforms[4].position.set(0, 5.5, -6);


  // tall platform
  platforms[5].position.set(4, 9.25, -2)

  // platform with spikes but they're on the ground
  platforms[6].position.set(10, 10, 4.5)
  spikes[2].position.set(10, 0, 4)

  //
  platforms[7].position.set(17, 12, 6);

  platforms[8].position.set(17, 13, 12);
  platforms[9].position.set(14, 16, 18.5);

  platforms.push(createRegularGrass(12, 8))
  platforms[10].position.set(3,14,20)

  const enemies = [mine, mine.explosion];



  const meshesToCollide = [...platforms, ...spikes, mine];

  return new Level(3, holePosition, respawnPoint, cameraPosition, meshesToCollide, enemies)
}
