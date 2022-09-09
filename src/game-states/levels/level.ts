import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {GroupedFaces} from "@/engine/grouped-faces";
import {doTimes} from "@/engine/helpers";
import {createDeadBody} from "@/modeling/golf-ball-man";
import {getGroupedFaces} from "@/engine/physics/parse-faces";
import {createHole} from "@/modeling/hole";
import {createStartPlatform} from "@/modeling/tee-platform";

export class Level {
  levelNumber: number;
  holePosition: EnhancedDOMPoint;
  respawnPoint: EnhancedDOMPoint;
  cameraPosition: EnhancedDOMPoint;
  scene: Scene = new Scene();
  deadBodies: Mesh[] =  [];
  meshesToRender: Mesh[];
  meshesToCollide: Mesh[];
  groupedFaces: GroupedFaces;

  constructor(
      levelNumber: number,
      holePosition: EnhancedDOMPoint,
      respawnPoint: EnhancedDOMPoint,
      cameraPosition: EnhancedDOMPoint,
      meshesToCollide: Mesh[],
      meshesToRender: Mesh[],

    ) {

    this.levelNumber = levelNumber;
    this.holePosition = holePosition;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.meshesToCollide = meshesToCollide;
    this.meshesToRender = meshesToRender;

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

    this.groupedFaces = getGroupedFaces(this.meshesToCollide);
    this.scene.add(...meshesToRender);
  }
}
