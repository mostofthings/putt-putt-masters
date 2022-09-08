import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Scene} from "@/engine/renderer/scene";
import {Level} from "@/game-states/levels/level";
import {createRegularGrass} from "@/modeling/regular-grass";
import {getGroupedFaces} from "@/engine/physics/parse-faces";
import {createStartPlatform} from "@/modeling/tee-platform";
import {createHole} from "@/modeling/hole";
import {createSpikedGround} from "@/modeling/spiked-ground";

export function getLevel1() {
  const holePosition = new EnhancedDOMPoint(0,.2,10);
  const respawnPoint = new EnhancedDOMPoint(0, 0, -15);
  const cameraPosition = new EnhancedDOMPoint(0,5,-20);

  const scene = new Scene();

  const ground = createRegularGrass(20, 40);
  ground.position.set(0,-2, 0)

  const platform = createStartPlatform(respawnPoint);
  const hole = createHole(holePosition);

  const spikes = createSpikedGround(20, 3);
  spikes.position.set(0, -.5, 5);


  const collidableObjects = [platform, hole, spikes, ground];
  collidableObjects.forEach(object => object.updateWorldMatrix())
  const groupedFaces = getGroupedFaces(collidableObjects);

  const levelParts = [...collidableObjects]

  // scene.add(this.player.mesh);
  scene.add(...levelParts);



  return new Level(1, holePosition, respawnPoint, cameraPosition, scene, groupedFaces)
}
