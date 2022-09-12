import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

export interface CollisionCylinder {
  feetCenter: EnhancedDOMPoint;
  height: number;
  collisionRadius: number;
  offsetY?: number;
}
