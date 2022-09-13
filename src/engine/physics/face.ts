import { calculateFaceNormal } from '@/engine/math-helpers';
import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import {Mesh} from "@/engine/renderer/mesh";
import {MovingMesh} from "@/modeling/MovingMesh";

export class Face {
  points: EnhancedDOMPoint[];
  normal: EnhancedDOMPoint;
  upperY: number;
  lowerY: number;
  originOffset: number;
  isDeadly: boolean;
  parentMesh?: MovingMesh;

  constructor(points: EnhancedDOMPoint[], normal?: EnhancedDOMPoint, isDeadly = false, parentMesh?: MovingMesh) {
    this.points = points;
    this.normal = normal ?? calculateFaceNormal(points);
    this.originOffset = -this.normal.dot(points[0]);
    const ys = points.map(point => point.y);
    this.upperY = Math.max(...ys);
    this.lowerY = Math.min(...ys);
    this.isDeadly = isDeadly;
    this.parentMesh = parentMesh;
  }
}
