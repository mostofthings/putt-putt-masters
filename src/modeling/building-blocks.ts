import { MakeMoldable } from '@/engine/moldable';
import { CubeGeometry } from '@/engine/cube-geometry';

const MoldableCube = MakeMoldable(CubeGeometry);

export function createHallway(width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, spacing: number) {
  const isHorizontal = width >= depth;
  const wallGeometry2 = new MoldableCube(width, height, depth, widthSegments, heightSegments, depthSegments)
    .translate(isHorizontal ? 0 : spacing, 0, isHorizontal ? spacing : 0);

  return new MoldableCube(width, height, depth, widthSegments, heightSegments, depthSegments)
    .translate(isHorizontal ? 0 : -spacing, 0, isHorizontal ? -spacing : 0)
    .merge(wallGeometry2)
    .computeNormalsPerPlane()
    .done();
}

export function createBox(width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number) {
  const spacing = (width - depth) / 2;
  const sideWidth = width - depth * 2;
  const segmentWidth = width / widthSegments;
  const widthInSegments = width / segmentWidth;
  const sideSpacing = (segmentWidth / 2) * (widthInSegments - 1);
  const verticalWalls = createHallway(sideWidth, height, segmentWidth, Math.ceil(widthSegments * (sideWidth / width)), heightSegments, depthSegments, sideSpacing).all().rotate(0, Math.PI / 2, 0).done();
  return createHallway(width, height, depth, widthSegments, heightSegments, depthSegments, spacing).merge(verticalWalls).computeNormalsPerPlane().done();
}
