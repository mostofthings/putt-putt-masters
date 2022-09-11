import {EnhancedDOMPoint, VectorLike} from "@/engine/enhanced-dom-point";
import {CollisionCylinder} from "@/modeling/collision-cylinder";

export function radsToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}
// (x * pi) / 180 = y

export function degreesToRads(degrees: number): number {
  return degrees * Math.PI / 180;
}

function unormalizedNormal(points: EnhancedDOMPoint[]): EnhancedDOMPoint {
  const u = points[2].clone().subtract(points[1]);
  const v = points[0].clone().subtract(points[1]);
  return new EnhancedDOMPoint().crossVectors(u, v)
}

export function calculateFaceNormal(points: EnhancedDOMPoint[]): EnhancedDOMPoint {
  return unormalizedNormal(points).normalize();
}

export function calculateVertexNormals(points: EnhancedDOMPoint[], indices: number[] | Uint16Array): EnhancedDOMPoint[] {
  const vertexNormals = points.map(point => new EnhancedDOMPoint());
  for (let i = 0; i < indices.length; i+= 3) {
    const faceNormal = unormalizedNormal([points[indices[i]], points[indices[i + 1]], points[indices[i + 2]]]);
    vertexNormals[indices[i]].add(faceNormal);
    vertexNormals[indices[i + 1]].add(faceNormal);
    vertexNormals[indices[i + 2]].add(faceNormal);
  }

  return vertexNormals.map(vector => vector.normalize());
}

export function isPointInRadius(pointToEval: EnhancedDOMPoint, centerPoint: EnhancedDOMPoint, radius: number): boolean {
  const distance = new EnhancedDOMPoint().subtractVectors(pointToEval, centerPoint).magnitude;
  return distance < radius
}

export function areCylindersColliding(cylinder1: CollisionCylinder, cylinder2: CollisionCylinder): true | undefined {
  if (cylinder1.feetCenter.y + cylinder1.height < cylinder2.feetCenter.y) {
    return
  }

  if (cylinder1.feetCenter.y > cylinder2.feetCenter.y + cylinder2.height) {
    return;
  }

  const magnitude = Math.sqrt(Math.pow((cylinder2.feetCenter.x - cylinder1.feetCenter.x), 2) + Math.pow((cylinder2.feetCenter.z - cylinder1.feetCenter.z), 2));

  if (magnitude < cylinder1.collisionRadius + cylinder2.collisionRadius) {
    return true;
  }
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
