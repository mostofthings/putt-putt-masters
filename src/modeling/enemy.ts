import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Material} from "@/engine/renderer/material";
import {CollisionCylinder} from "@/modeling/collision-cylinder";

export class Enemy extends Mesh implements CollisionCylinder {
  feetCenter: EnhancedDOMPoint;
  collisionRadius: number;
  height: number;
  isDeadly: boolean;
  shouldBeRemovedFromScene = false;
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

    this.position.set(feetCenter);
  }
}

 export function isEnemy(candidate: any): candidate is Enemy {
  return candidate.hasOwnProperty('onCollide');
 }
