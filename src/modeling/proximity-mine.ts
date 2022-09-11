import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {Material} from "@/engine/renderer/material";
import {doTimes} from "@/engine/helpers";
import {degreesToRads} from "@/engine/math-helpers";
import {createSpike} from "@/modeling/spike";
import {Enemy} from "@/modeling/enemy";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";

export class ProximityMine extends Enemy {
  isExploding = false;

  constructor(feetCenter: EnhancedDOMPoint) {
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


    const update = () => this.updateExplosion()
    const onCollide = () => { this.isExploding = true; }

    super(feetCenter, 2, 1, bodyGeometry, new Material({color: '#666'}), update, onCollide);

    const explosionGeometry = new MoldableCubeGeometry(5,5,5,5,5,5)
      .spherify(2.5)
      .scale(.05,.05,.05)
      .computeNormalsCrossPlane()
      .done();

    // explosion has same feetCenter as otherwise the mine blows itself up
    const explosion = new Enemy(feetCenter, .25, .25, explosionGeometry, new Material({ color: 'red', isTransparent: true }), undefined, undefined, true)

    this.position.set(feetCenter);
    // explosion must be centered within the mine body
    explosion.position.set(feetCenter);
    this.add(explosion)


  }

  updateExplosion() {
    if (!this.isExploding) {
      return;
    }

    if (this.explosion.scale.x < 35) {
      this.explosion.scale.x += .9;
      this.explosion.scale.y += .9;
      this.explosion.scale.z += .9;

      this.explosion!.collisionRadius += .1;
      this.explosion!.height += .1;
    } else {
      this.scale.set(0, 0, 0);
      this.collisionRadius = 0;
      this.explosion.scale.set(0, 0, 0);
      this.explosion.collisionRadius = 0;
      this.explosion.height = 0;
      this.explosion.isDeadly = false;
      this.isExploding = false;
      this.update = () => {};
      // TODO: remove explosion and mine from meshes to render, meshes to collide, and enemies instead of messing
      // with scale and all this
    }
  }

  get explosion() {
    return this.children[0] as Enemy;
  }
}
