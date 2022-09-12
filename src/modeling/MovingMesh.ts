import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

const debugElement = document.querySelector('#debug')!;


export class MovingMesh extends Mesh {
  distanceToTravel: number;
  distanceTraveled = 0;
  isIncrease = true;
  movementVector: EnhancedDOMPoint;

  constructor(geometry: MoldableCubeGeometry, material: Material, movementVector: EnhancedDOMPoint, distanceToTravel: number) {
    super(geometry, material);
    this.distanceToTravel = distanceToTravel;
    this.movementVector = movementVector;
  }

  update() {
    console.log(this)
    if (this.isIncrease) {
      this.position.add(this.movementVector);
      this.distanceTraveled += this.movementVector.magnitude;
      this.isIncrease = this.distanceTraveled < this.distanceToTravel;
    } else {
      this.position.subtract(this.movementVector);
      this.distanceTraveled -= this.movementVector.magnitude;
      this.isIncrease = this.distanceTraveled <= 0;
    }
    this.updateWorldMatrix();
  }
}

export function isMovingMesh(candidate: Mesh | MovingMesh): candidate is MovingMesh {
  return candidate.hasOwnProperty('movementVector');
}
