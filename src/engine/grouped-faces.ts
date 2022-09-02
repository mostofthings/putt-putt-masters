import {Face} from "@/engine/physics/face";

export interface GroupedFaces {
  floorFaces: Face[],
  wallFaces: Face[],
  ceilingFaces: Face[],
}
