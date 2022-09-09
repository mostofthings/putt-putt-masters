import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";

export class Enemy extends Mesh {
  feetCenter: EnhancedDOMPoint;
  collisionRadius: number;
  height: number;
  isDeadly: boolean;
  update: () => void;
  onCollide: () => void;

  constructor(
    feetCenter: EnhancedDOMPoint,
    radius: number,
    height: number,
    geometry: MoldableCubeGeometry,
    material: Material,
    update: () => void = () => {},
    onCollide: () => void = () => {},
    isDeadly = false,
  ) {
    super(geometry, material);

    this.feetCenter = feetCenter;
    this.collisionRadius = radius;
    this.height = height;
    this.update = update
    this.onCollide = onCollide;
    this.isDeadly = isDeadly;
  }
}

 export function isEnemy(candidate: any): candidate is Enemy {
  return candidate.hasOwnProperty('onCollide');
 }
