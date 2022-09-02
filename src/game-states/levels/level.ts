import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {Face} from "@/engine/physics/face";
import {GroupedFaces} from "@/engine/grouped-faces";

export class Level {
  levelNumber: number;
  holePosition: EnhancedDOMPoint;
  respawnPoint: EnhancedDOMPoint;
  cameraPosition: EnhancedDOMPoint;
  scene: Scene;
  groupedFaces: GroupedFaces;
  meshesToRender?: Mesh[];
  meshesToCollide?: Mesh[];


  constructor(
      levelNumber: number,
      holePosition: EnhancedDOMPoint,
      respawnPoint: EnhancedDOMPoint,
      cameraPosition: EnhancedDOMPoint,
      scene: Scene,
      groupedFaces: GroupedFaces,
    ) {

    this.levelNumber = levelNumber;
    this.holePosition = holePosition;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.scene = scene;
    this.groupedFaces = groupedFaces;
  }
}
