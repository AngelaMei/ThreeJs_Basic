import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

const STRAIGHT_ROAD_LENGTH = 20;
const CURVE_ROAD_LENGTH = 15;

export default class TrackManager {
  constructor(scene) {
    this.scene = scene;
    this.currentPosition = {
      x: 0,
      z: 0,
    };
    this.direction = {
      x: 1,
      z: 0,
    };

    document.getElementById("create_straight").addEventListener('click', this.createNextStraightRoad);
    document.getElementById("create_curve").addEventListener('click', this.createNextLeftCurveRoad);
  }

  directionToAngle = (direction) => {
    if (direction.x == 1 && direction.z == 0) return 0;
    else if (direction.x == 0 && direction.z == 1) return -Math.PI / 2;
    else if (direction.x == -1 && direction.z == 0) return Math.PI;
    else if (direction.x == 0 && direction.z == -1) return Math.PI / 2;
  }

  createRoad = (x, z, rotate) => {
      let road = null
      gltfLoader.load(
          '/models/Straight.glb',
          (gltf) =>
          {
              road = gltf;
              road.scene.scale.set(10, 5, 5);
              road.scene.position.set(x, 0.1, z);
              road.scene.rotateY(rotate);
              this.scene.add(road.scene);
          }
      )
  }

  createLeftCurve = (x, z, rotate) => {
      let curve = null
      gltfLoader.load(
          '/models/roadCurve2.glb',
          (gltf) =>
          {
              curve = gltf;
              curve.scene.scale.set(5, 5, 5);
              curve.scene.position.set(x, 0.1, z);
              curve.scene.rotateY(rotate);
              this.scene.add(curve.scene);
              console.log(gltf);
          }
      )
  }

  createNextStraightRoad = () => {
    this.createRoad(this.currentPosition.x, this.currentPosition.z,
        this.directionToAngle(this.direction));
    this.currentPosition.x += this.direction.x * STRAIGHT_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * STRAIGHT_ROAD_LENGTH;

    console.log(this.currentPosition);
  }

  createNextLeftCurveRoad = () => {
    this.createLeftCurve(this.currentPosition.x, this.currentPosition.z,
        this.directionToAngle(this.direction));

    this.currentPosition.x += this.direction.x * CURVE_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * CURVE_ROAD_LENGTH;

    this.direction = {
      x: this.direction.z,
      z: -this.direction.x,
    };

    this.currentPosition.x += this.direction.x * CURVE_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * CURVE_ROAD_LENGTH;
  }
}
