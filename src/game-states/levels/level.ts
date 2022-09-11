import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {GroupedFaces} from "@/engine/grouped-faces";
import {doTimes} from "@/engine/helpers";
import {createDeadBody} from "@/modeling/golf-ball-man";
import {getGroupedFaces} from "@/engine/physics/parse-faces";
import {createHole} from "@/modeling/hole";
import {createStartPlatform} from "@/modeling/tee-platform";
import {Object3d} from "@/engine/renderer/object-3d";
import {Enemy} from "@/modeling/enemy";

export class Level {
  levelNumber: number;
  holePosition: EnhancedDOMPoint;
  respawnPoint: EnhancedDOMPoint;
  cameraPosition: EnhancedDOMPoint;
  scene: Scene = new Scene();
  deadBodies: Mesh[] = [];
  enemies: Enemy[];
  meshesToRender: Mesh[];
  meshesToCollide: Mesh[];
  groupedFaces!: GroupedFaces;

  constructor(
      levelNumber: number,
      holePosition: EnhancedDOMPoint,
      respawnPoint: EnhancedDOMPoint,
      cameraPosition: EnhancedDOMPoint,
      meshesToCollide: (Object3d | Mesh)[],
      meshesToRender: (Object3d | Mesh)[],
      enemies: Enemy[] = [],
    ) {

    this.levelNumber = levelNumber;
    this.holePosition = holePosition;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.enemies = enemies;
    this.meshesToCollide = meshesToCollide as Mesh[];
    this.meshesToRender = meshesToRender as Mesh[];

    const collidableMeshesToAdd = [createHole(holePosition), createStartPlatform(respawnPoint)]

    doTimes(50, (index) => {
      const body = createDeadBody();
      body.position.set(1000, 0, 0)
      collidableMeshesToAdd.push(body);
      this.deadBodies.push(body)
    })
    this.meshesToRender.unshift(...collidableMeshesToAdd);
    this.meshesToCollide.unshift(...collidableMeshesToAdd);
    this.meshesToCollide.forEach(mesh => mesh.updateWorldMatrix());

    this.updateGroupedFaces();
    this.scene.add(...meshesToRender);
  }

  updateGroupedFaces() {
    this.groupedFaces = getGroupedFaces(this.meshesToCollide)
  }
}
