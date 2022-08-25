import { createBox } from '@/modeling/building-blocks';
import { Mesh } from '@/engine/renderer/mesh';
import { materials } from '@/texture-maker';
import { Object3d } from '@/engine/renderer/object-3d';
import { MakeMoldable } from '@/engine/moldable';
import { CubeGeometry } from '@/engine/cube-geometry';
const MoldableCube = MakeMoldable(CubeGeometry);

function createTire() {
  return createBox(6, 2, 1, 6, 1, 1)
    .selectBy(vertex => Math.abs(vertex.x) < 2.5 && Math.abs(vertex.z) < 2.5)
    .cylindrify(1.5, 'y')
    .invertSelection()
    .cylindrify(3.5, 'y')
    .all()
    .rotate(0, 0, Math.PI / 2)
    .computeNormalsCrossPlane()
    .done();
}

function createWheel() {
  return new MoldableCube(2, 2, 2, 4, 1, 4)
    .selectBy(vertex => Math.abs(vertex.x) > 0.4 && Math.abs(vertex.z) > 0.4)
    .cylindrify(1.5)
    .invertSelection()
    .scale(1, 0.5, 1)
    .all()
    .rotate(0, 0, Math.PI / 2)
    .computeNormalsPerPlane()
    .done();
}

function createWheelAndTire() {
  const wheelGeometry = createWheel();
  const wheel = new Mesh(
    wheelGeometry,
    materials.wheel,
  );

  const tireGeometry = createTire();
  const tire = new Mesh(
    tireGeometry,
    materials.tire,
  );

  const wheelAndTire = new Object3d(wheel, tire);
  wheelAndTire.scale.set(1.5, 0.5, 0.5);
  return wheelAndTire;
}

function createWheelPair() {
  const leftWheel = createWheelAndTire();
  // leftWheel.rotate(0, 0, Math.PI / 2);
  leftWheel.position.x -= 4;

  const rightWheel = createWheelAndTire();
  // rightWheel.rotate(0, 0, Math.PI / 2);
  rightWheel.position.x += 4;

  return new Object3d(leftWheel, rightWheel);
}

function createChassis() {
  const cab = new MoldableCube(8, 3, 9, 3, 3, 4)
    .selectBy(vertex => vertex.y > 1 && (vertex.z < 3 && vertex.z > -2))
    .translate(0, 2, 2.3)

  const bed = createBox(8, 3, 0.8, 6, 2, 1)
    .rotate(0, Math.PI / 2)
    .merge(new MoldableCube(8, 1.5, 8).translate(0, -0.8)) // floor of bed
    .translate(0, 0, 7.5)
    .done();

  const chassisGeometry = cab.merge(bed)
    .computeNormalsPerPlane()
    .done();

  const chassis = new Mesh(
    chassisGeometry,
    materials.chassis,
  );
  chassis.position.y += 2;
  chassis.position.z += 3;
  chassis.scale.z = 0.9;
  chassis.rotate(0, Math.PI, 0);
  return chassis;
}

const frontWheels = createWheelPair();
const rearWheels = createWheelPair();
frontWheels.position.z += 4;
rearWheels.position.z -= 4;

export const truck = new Object3d(frontWheels, rearWheels, createChassis());
