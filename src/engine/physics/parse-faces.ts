import { Face } from './face';
import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { AttributeLocation } from '@/engine/renderer/renderer';
import { Mesh } from '@/engine/renderer/mesh';
import {GroupedFaces} from "@/engine/grouped-faces";
import {isMovingMesh, MovingMesh} from "@/modeling/MovingMesh";

function indexToFaceVertexPoint(index: number, positionData: Float32Array, matrix: DOMMatrix): EnhancedDOMPoint {
  return new EnhancedDOMPoint().set(
    matrix.transformPoint(new EnhancedDOMPoint(positionData[index], positionData[index + 1], positionData[index + 2]))
  )
}

export function getGroupedFaces(meshes: (Mesh |  MovingMesh)[]): GroupedFaces {
  const faces = meshes.flatMap(mesh => {
    const indices = mesh.geometry.getIndices()!; // assuming always having indices

    const positions = mesh.geometry.getAttribute(AttributeLocation.Positions);
    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
      const firstIndex = indices[i] * 3;
      const secondIndex = indices[i + 1] * 3;
      const thirdIndex = indices[i + 2] * 3;

      const point0 = indexToFaceVertexPoint(firstIndex, positions.data, mesh.worldMatrix);
      const point1 = indexToFaceVertexPoint(secondIndex, positions.data, mesh.worldMatrix);
      const point2 = indexToFaceVertexPoint(thirdIndex, positions.data, mesh.worldMatrix);

      triangles.push([
        point0,
        point1,
        point2,
      ]);
    }

    return triangles.map(triangle => new Face(triangle, undefined, mesh.isDeadly, isMovingMesh(mesh) ? mesh : undefined));
  }).sort((a, b) => a.upperY > b.upperY ? -1 : 1);

  const floorFaces: Face[] = [];
  const wallFaces: Face[] = [];
  const ceilingFaces: Face[] = [];

  faces.forEach(face => {
    if (face.normal.y > 0.5) {
      floorFaces.push(face);
    } else if (face.normal.y < -0.5) {
      ceilingFaces.push(face);
    } else {
      wallFaces.push(face);
    }
  });

  return {
    floorFaces,
    wallFaces,
    ceilingFaces,
  };
}
