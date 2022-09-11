import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {GroupedFaces} from "@/engine/grouped-faces";
import {doTimes} from "@/engine/helpers";
import {createDeadBody} from "@/modeling/golf-ball-man";
import {getGroupedFaces} from "@/engine/physics/parse-faces";
import {Hole} from "@/modeling/hole";
import {createStartPlatform} from "@/modeling/tee-platform";
import {Object3d} from "@/engine/renderer/object-3d";
import {Enemy, isEnemy} from "@/modeling/enemy";

export class Level {
  levelNumber: number;
  hole: Hole;
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
    meshesToCollide: (Object3d | Mesh | Enemy)[],
    enemies: Enemy[] = [],
    remainingMeshesToRender: (Object3d | Mesh)[] = [],
    ) {

    this.levelNumber = levelNumber;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.enemies = enemies;

    this.hole = new Hole(holePosition)
    const collidableMeshesToAdd = [this.hole, createStartPlatform(respawnPoint)]

    doTimes(50, (index) => {
      const body = createDeadBody();
      body.position.set(1000, 0, 0)
      collidableMeshesToAdd.push(body);
      this.deadBodies.push(body)
    });

    this.meshesToCollide = [...meshesToCollide, ...collidableMeshesToAdd] as Mesh[];
    this.meshesToRender = [...remainingMeshesToRender, ...this.meshesToCollide, ...this.enemies] as Mesh[];
    /// TODO: this may be unnecessary
    this.meshesToCollide.forEach(mesh => mesh.updateWorldMatrix());

    this.updateGroupedFaces();
    this.scene.add(...this.meshesToRender);
  }

  updateGroupedFaces() {
    // remove collision for dead enemies
    this.meshesToCollide = this.meshesToCollide.filter(meshOrEnemy => !isEnemy(meshOrEnemy) || !meshOrEnemy.shouldBeRemovedFromScene)
    this.groupedFaces = getGroupedFaces(this.meshesToCollide)
  }
}
