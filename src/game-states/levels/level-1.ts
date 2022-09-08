import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Scene} from "@/engine/renderer/scene";
import {drawCurrentTexture, drawLandscape, drawParticle, materials} from "@/texture-maker";
import {Mesh} from "@/engine/renderer/mesh";
import {PlaneGeometry} from "@/engine/plane-geometry";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Object3d} from "@/engine/renderer/object-3d";
import {textureLoader} from "@/engine/renderer/texture-loader";
import {Material} from "@/engine/renderer/material";
import {getGroupedFaces} from "@/engine/physics/parse-faces";
import {doTimes} from "@/engine/helpers";
import {findFloorHeightAtPosition} from "@/engine/physics/surface-collision";
import {InstancedMesh} from "@/engine/renderer/instanced-mesh";
import {largeTree, leavesMesh, plant1} from "@/modeling/flora";
import {Level} from "@/game-states/levels/level";
import {getHole} from "@/modeling/hole";
import {makeSpikedGround} from "@/modeling/spiked-ground";
import {createProximityMine} from "@/modeling/proximity-mine";


export function getLevel1() {
  const holePosition = new EnhancedDOMPoint(-2,1.25,15);
  const respawnPoint = new EnhancedDOMPoint(0,1.5,0);
  const cameraPosition = new EnhancedDOMPoint(2,2,-2);

  const scene = new Scene();

  const sampleHeightMap: number[] = [];
  const imageData = drawLandscape().data;
  for (let i = 0; i < imageData.length; i+= 4) {
    sampleHeightMap.push(imageData[i] / 10 - 10);
  }

  const floor = new Mesh(
    new PlaneGeometry(255, 255, 127, 127, sampleHeightMap),
    materials.grass
  );

  const lake = new Mesh(
    new PlaneGeometry(200, 200, 1, 1),
    materials.lake
  );
  lake.position.y = -5.4 //-7.9;

  const rampGeometry = new MoldableCubeGeometry(3, 13, 13);
  rampGeometry
    .selectVertices(1, 4, 8, 9, 20, 21)
    .translate(0, -8)
    .selectVertices(1)
    .delete()
    .computeNormalsPerPlane()
    .done();

  const ramp = new Mesh(rampGeometry, materials.marble);

  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }



  function makeTree() {
    const trunkGeo = new MoldableCubeGeometry(1, 4, 1, 3, 3, 3)
      .cylindrify(0.5)
      .computeNormalsCrossPlane()
      .done();

    const trunk = new Mesh(trunkGeo, materials.wood);

    const foliageGeometry = new MoldableCubeGeometry(4, 4, 4, 4, 4, 4);
    foliageGeometry
      .spherify(4)
      .scale(1, 1.5, 1)
      .noisify(2, 0.02)
      .computeNormalsCrossPlane()
      .done()

    const leaves = new Mesh(foliageGeometry, materials.treeLeaves);
    leaves.position.y += 6;
    return new Object3d(trunk, leaves);
  }

  const tree = makeTree();
  tree.position.x += 10;
  tree.position.z += 40;
  tree.position.y += 10;
  tree.updateWorldMatrix();
  //

  function makeBridge() {
    const supportArchGeo = new MoldableCubeGeometry(16, 1, 2, 10, 1, 1);
    let start = 0; let end = 3;
    // doTimes(10, index => {
    //   supportArchGeo.selectVertices(...range(start, end))
    //     .rotate(0, 0, 0.3)
    //     .done();
    //   start +=
    // })
    const supportArch = new Mesh(supportArchGeo, materials.tiles);
    return supportArch;
  }
  const bridge = makeBridge();
  bridge.position.y += 4;

  const wall = new Mesh(
    new MoldableCubeGeometry(3, 4, 4),
    materials.bricks,
  );

  wall.position.x = -6;
  wall.updateWorldMatrix();

  const particleGeometry = new PlaneGeometry(2, 2);
  const particleTexture = textureLoader.load(drawParticle());
  const particleMaterial = new Material({emissive: '#fff', texture: particleTexture, isTransparent: true});
  const particle = new Mesh(
    particleGeometry,
    particleMaterial
  );

  const particle2 = new Mesh(
    particleGeometry,
    particleMaterial
  );

  particle.position.y += 5;
  particle2.position.y += 4.5;

  const terrain = getGroupedFaces([floor]); // TODO: Allow passing in of threshold for walls. This will help with tree placement as anything too steep can be discarded.
  const count = 243;
  const transforms: DOMMatrix[] = [];
  doTimes(count, () => {
    const translateX = getRandomArbitrary(-127, 127);
    const translateZ = getRandomArbitrary(-127, 127);
    const translateY = findFloorHeightAtPosition(terrain.floorFaces, new EnhancedDOMPoint(translateX, 500, translateZ))!.height;

    const transformMatrix = new DOMMatrix().translate(translateX, translateY, translateZ).rotate(0, getRandomArbitrary(-90, 90), 0);
    // Using the transform matrix as the normal matrix is of course not strictly correct, but it largely works as long as the
    // transform matrix doesn't heavily squash the mesh and this avoids having to write a matrix transpose method just for
    // instanced drawing.
    transforms.push(transformMatrix);
  });
  const instancedTest = new InstancedMesh(plant1.geometry, transforms, count, plant1.material);

  const count2 = 43;
  const transforms2: DOMMatrix[] = [];
  doTimes(count2, () => {
    const translateX = getRandomArbitrary(-127, 127);
    const translateZ = getRandomArbitrary(-127, 127);
    const translateY = findFloorHeightAtPosition(terrain.floorFaces, new EnhancedDOMPoint(translateX, 500, translateZ))!.height;

    const transformMatrix = new DOMMatrix().translate(translateX, translateY, translateZ).rotate(0, getRandomArbitrary(-90, 90), 0);
    // Using the transform matrix as the normal matrix is of course not strictly correct, but it largely works as long as the
    // transform matrix doesn't heavily squash the mesh and this avoids having to write a matrix transpose method just for
    // instanced drawing.
    transforms2.push(transformMatrix);
  });
  const instancedTest2 = new InstancedMesh(largeTree.geometry, transforms2, count2, largeTree.material);
  const treeLeaves = new InstancedMesh(leavesMesh.geometry, transforms2, count2, leavesMesh.material);


// TESTING
  drawCurrentTexture();
// END TESTING

  const testCube = new MoldableCubeGeometry(3, 3, 3, 1, 1, 1);
  const test = new Mesh(testCube, materials.bricks,);

  const hole = getHole();
  hole.position.set(holePosition);

  const mine = createProximityMine();
  mine.position.set(4, 1, -4);

  const spikes = makeSpikedGround(10,2);
  spikes.position.set(-2,1.25,15)

  const levelParts = [ramp, wall, floor, lake, tree, bridge, test, instancedTest, instancedTest2, treeLeaves, hole, spikes, mine];

  const groupedFaces = getGroupedFaces([ramp, wall, floor, lake]);
  levelParts.push(particle);
  levelParts.push(particle2);

  // scene.add(this.player.mesh);
  scene.add(...levelParts);

  return new Level(1, holePosition, respawnPoint, cameraPosition, scene, groupedFaces)
}

