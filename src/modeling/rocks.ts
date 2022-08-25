import { Mesh } from '@/engine/renderer/mesh';
import { materials } from '@/texture-maker';
import { MakeMoldable } from '@/engine/moldable';
import { CubeGeometry } from '@/engine/cube-geometry';

const MoldableCube = MakeMoldable(CubeGeometry);

function makeRock(start: any, baseScale: number, scaleX: number, scaleY: number, scaleZ: number, noiseSeed: number, noiseScale: number) {
  start.spherify(baseScale).scale(scaleX, scaleY, scaleZ).noisify(noiseSeed, noiseScale).computeNormalsCrossPlane().done();
  return new Mesh(start, materials.marble);
}

export const smallRock = makeRock(new MoldableCube(2, 3, 3, 3, 3, 3), 1, 2.3, 1, 2, 3, 0.03);
export const mediumRock = makeRock(new MoldableCube(2, 3, 3, 3, 3, 3), 1.4, 3, 1.4, 1.2, 12, 0.04);
export const largeRock = makeRock(new MoldableCube(3, 3, 3, 2, 3, 1), 3, 4, 2.3, 2, 22, 0.07);
