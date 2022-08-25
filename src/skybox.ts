import { BufferGeometry } from '@/engine/renderer/buffer-geometry';
import { AttributeLocation } from '@/engine/renderer/renderer';
import { gl } from '@/engine/renderer/lil-gl';

export class Skybox extends BufferGeometry {
  constructor(...textureSources: (ImageData | HTMLCanvasElement)[]) {
    super();
    const cubemapTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
    textureSources.forEach((tex, index) => {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex);
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    this.setAttribute(AttributeLocation.Positions, new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]), 2);
  }
}
