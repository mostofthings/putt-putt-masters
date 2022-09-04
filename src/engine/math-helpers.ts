import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";

export function radsToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
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
