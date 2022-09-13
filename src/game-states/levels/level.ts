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
import {isMovingMesh, MovingMesh} from "@/modeling/MovingMesh";

export class Level {
  levelNumber: number;
  hole: Hole;
  respawnPoint: EnhancedDOMPoint;
  cameraPosition: EnhancedDOMPoint;
  scene: Scene = new Scene();
  deadBodies: Mesh[] = [];
  deadBodyCollisionMeshes: Mesh[] = [];
  enemies: Enemy[];
  meshesToRender: Mesh[];
  staticMeshesToCollide: Mesh[];
  dynamicMeshesToCollide: (Mesh | MovingMesh)[];
  groupedFaces!: GroupedFaces;
  staticGroupedFaces!: GroupedFaces;
  dynamicGroupedFaces!: GroupedFaces;

  constructor(
    levelNumber: number,
    holePosition: EnhancedDOMPoint,
    respawnPoint: EnhancedDOMPoint,
    cameraPosition: EnhancedDOMPoint,
    meshesToRender: Mesh[],
    meshesToCollide: (Object3d | Mesh | Enemy)[],
    dynamicMeshesToCollide: (Mesh | MovingMesh)[] = [],
    enemies: Enemy[] = [],
    ) {

    this.levelNumber = levelNumber;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.dynamicMeshesToCollide = dynamicMeshesToCollide;
    this.enemies = enemies;

    this.hole = new Hole(holePosition)
    const holePlatformAndBodies = [this.hole, createStartPlatform(respawnPoint)]

    doTimes(50, (index) => {
      const {body, bodyCollision} = createDeadBody();
      body.position.set(1000, 0, 0);
      bodyCollision.position.set(1000, 0, 0);
      this.deadBodies.push(body)
      this.deadBodyCollisionMeshes.push(bodyCollision);
      body.updateWorldMatrix();
    });


    this.staticMeshesToCollide = [...meshesToCollide, ...holePlatformAndBodies, ...this.deadBodyCollisionMeshes] as Mesh[];
    /// TODO: this may be unnecessary
    this.staticMeshesToCollide.forEach(mesh => mesh.updateWorldMatrix());

    this.updateAllGroupedFaces();
    this.meshesToRender = [...meshesToRender, ...holePlatformAndBodies, ...this.deadBodies];
    this.scene.add(...this.meshesToRender);
  }

  updateAllGroupedFaces() {
    // remove collision for dead enemies, add for dead bodies
    this.staticMeshesToCollide = this.staticMeshesToCollide.filter(meshOrEnemy => !isEnemy(meshOrEnemy) || !meshOrEnemy.shouldBeRemovedFromScene)
    this.staticGroupedFaces = getGroupedFaces(this.staticMeshesToCollide)
    this.updateDynamicGroupedFaces();
  }

  updateDynamicMeshPosition() {
    if (!this.dynamicMeshesToCollide.length) {
      return;
    }
    // move platforms and stuff
    this.dynamicMeshesToCollide.forEach(mesh => {
      if (isMovingMesh(mesh)) {
        mesh.update()
      }
    } );
    this.updateDynamicGroupedFaces();
  }

  updateDynamicGroupedFaces() {
    this.dynamicGroupedFaces = getGroupedFaces(this.dynamicMeshesToCollide);
    this.groupedFaces = {
      floorFaces: [...this.dynamicGroupedFaces.floorFaces, ...this.staticGroupedFaces.floorFaces],
      wallFaces: [...this.dynamicGroupedFaces.wallFaces, ...this.staticGroupedFaces.wallFaces],
      ceilingFaces: [...this.dynamicGroupedFaces.ceilingFaces, ...this.staticGroupedFaces.ceilingFaces],
    }
  }

}
