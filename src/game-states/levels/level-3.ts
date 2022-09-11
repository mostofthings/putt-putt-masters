import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";

export function getLevel3() {
  const holePosition = new EnhancedDOMPoint(0,2,12);
  const respawnPoint = new EnhancedDOMPoint(0, -1, 0);
  const cameraPosition = new EnhancedDOMPoint(0,5,-20);

  const platforms = [createRegularGrass(100, 100)];

  const meshesToCollide = [...platforms];

  return new Level(2, holePosition, respawnPoint, cameraPosition, meshesToCollide)
}
