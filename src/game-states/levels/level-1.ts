import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {createStartPlatform} from "@/modeling/tee-platform";
import {createSpikedGround} from "@/modeling/spiked-ground";
import {ProximityMine} from "@/modeling/proximity-mine";
import {Enemy} from "@/modeling/enemy";

export function getLevel1() {
  const holePosition = new EnhancedDOMPoint(0,-.5,12);
  const respawnPoint = new EnhancedDOMPoint(0, -1, -15);
  const cameraPosition = new EnhancedDOMPoint(0,5,-20);

  const ground = createRegularGrass(20, 40);
  ground.position.set(0,-2, 0);

  const obstacles = [createRegularGrass(9.5, 3, 4), createRegularGrass(9.5, 3, 4)]
  obstacles[0].position.set(-5.5, 0, -4);
  obstacles[1].position.set(5.5, 0, -4);


  const platform = createStartPlatform(respawnPoint);

  const spikes = createSpikedGround(20, 3);
  spikes.position.set(0, -.5, 4);

  const mine = new ProximityMine(new EnhancedDOMPoint(0, 0, -4));

  const enemies = [mine, mine.explosion] as Enemy[];


  const meshesToCollide = [mine, platform, spikes, ground, ...obstacles];
  meshesToCollide.forEach(object => object.updateWorldMatrix())

  const meshesToRender = [...meshesToCollide, ...enemies]


  return new Level(1, holePosition, respawnPoint, cameraPosition, meshesToCollide, meshesToRender, enemies)
}
