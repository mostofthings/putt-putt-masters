import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {Face} from "@/engine/physics/face";

export class Level {
  levelNumber: number;
  holePosition: EnhancedDOMPoint;
  respawnPoint: EnhancedDOMPoint;
  cameraPosition: EnhancedDOMPoint;
  sceneCallback: () => { scene: Scene, groupedFaces: {floorFaces: Face[], wallFaces: Face[], ceilingFaces: Face[]} };
  meshesToRender?: Mesh[];
  meshesToCollide?: Mesh[];


  constructor(
      levelNumber: number,
      holePosition: EnhancedDOMPoint,
      respawnPoint: EnhancedDOMPoint,
      cameraPosition: EnhancedDOMPoint,
      sceneCallback: () => { scene: Scene, groupedFaces: {floorFaces: Face[], wallFaces: Face[], ceilingFaces: Face[]} },
    ) {

    this.levelNumber = levelNumber;
    this.holePosition = holePosition;
    this.respawnPoint = respawnPoint;
    this.cameraPosition = cameraPosition;
    this.sceneCallback = sceneCallback;
  }
}
