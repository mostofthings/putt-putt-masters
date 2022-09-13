import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";


export class MovingMesh extends Mesh {
  distanceToTravel: number;
  distanceTraveled = 0;
  isIncrease = true;
  movementVector: EnhancedDOMPoint;
  otherMeshesToMove: Mesh[] = [];

  constructor(geometry: MoldableCubeGeometry, material: Material, movementVector: EnhancedDOMPoint, distanceToTravel: number) {
    super(geometry, material);
    this.distanceToTravel = distanceToTravel;
    this.movementVector = movementVector;
  }

  update() {
    // assignment happens of isIncrease first so internal and external sources of truth for movement are the same
    if (this.isIncrease) {
      this.isIncrease = this.distanceTraveled < this.distanceToTravel;
    } else {
      this.isIncrease = this.distanceTraveled <= 0;
    }

    if (this.isIncrease) {
      this.position.add(this.movementVector);
      this.distanceTraveled += this.movementVector.magnitude;
      this.otherMeshesToMove.forEach(mesh => mesh.position.add(this.movementVector));
    } else {
      this.position.subtract(this.movementVector);
      this.distanceTraveled -= this.movementVector.magnitude;
      this.otherMeshesToMove.forEach(mesh => mesh.position.subtract(this.movementVector));
    }
    this.updateWorldMatrix();
  }
}

export function isMovingMesh(candidate: Mesh | MovingMesh): candidate is MovingMesh {
  return candidate.hasOwnProperty('movementVector');
}
