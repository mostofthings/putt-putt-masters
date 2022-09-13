import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {degreesToRads} from "@/engine/math-helpers";
import {createSpike} from "@/modeling/spike";
import {Enemy} from "@/modeling/enemy";
import {EnhancedDOMPoint, VectorLike} from "@/engine/enhanced-dom-point";
import {explosionTexture} from "@/texture-maker";

export class ProximityMine extends Enemy {
  explosion: Enemy;

  constructor(x: number , y: number, z: number) {
    const feetCenter = new EnhancedDOMPoint(x, y, z);
    const bodyGeometry = new MoldableCubeGeometry(1.5,1,1.5,4,1,4)
      .cylindrify(.75)

    doTimes(8, (index) => {
      const spike = createSpike(.25, 1);
      const spikeDirection = degreesToRads(45 * index);
      spike.rotate(degreesToRads(90), spikeDirection, 0);
      spike.translate(Math.sin(spikeDirection), 0, Math.cos(spikeDirection));
      bodyGeometry.merge(spike);
    })
    bodyGeometry.done();


    super(feetCenter, 2, 1, bodyGeometry, new Material({color: '#666'}));

    const explosionGeometry = new MoldableCubeGeometry(5,5,5,5,5,5)
      .spherify(2.5)
      .scale(.05,.05,.05)
      .computeNormalsCrossPlane()
      .done();


    // explosion has same feetCenter as otherwise the mine blows itself up
    this.explosion = new Enemy(feetCenter, .25, .25, explosionGeometry, new Material({ texture: explosionTexture, isTransparent: true, emissive: '#fff' }))
  }

  updateExplosion() {
    if (!this.explosion.isDeadly) {
      return;
    }

    if (this.explosion.scale.x < 35) {
      this.explosion.scale.x += .9;
      this.explosion.scale.y += .9;
      this.explosion.scale.z += .9;

      this.explosion!.collisionRadius += .1;
      this.explosion!.height += .1;
    } else {
      this.shouldBeRemovedFromScene = true;
      this.explosion.shouldBeRemovedFromScene = true;
    }
  }

  // @ts-ignore
  update() {
    this.updateExplosion();
  }

  // @ts-ignore
  onCollide() {
    this.explosion.isDeadly = true;
  }
}
