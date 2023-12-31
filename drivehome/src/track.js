import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()

const STRAIGHT_ROAD_LENGTH = 20;
const CURVE_ROAD_LENGTH = 15;

export const SHAPE = {
  STRAIGHT: 0,
  RIGHT_CURVE: 1,
  LEFT_CURVE: 2,
}

export default class TrackManager {
  constructor(scene) {
    this.tracks = [];
    this.scene = scene;
    this.currentPosition = {
      x: 0,
      z: 0,
      y: 0,
    };
    this.direction = {
      x: 1,
      z: 0,
    };

    document.querySelector("#create_straight").addEventListener('click', this.createNextStraightRoad);
    document.querySelector("#create_L_curve").addEventListener('click', this.createNextLeftCurveRoad);
    document.querySelector("#create_R_curve").addEventListener('click', this.createNextRightCurveRoad);
    document.querySelector("#remove_latest_road").addEventListener('click', this.removeLatestRoad);
  }

  directionToAngle = (direction) => {
    if (direction.x == 1 && direction.z == 0) return 0;
    else if (direction.x == 0 && direction.z == 1) return -Math.PI / 2;
    else if (direction.x == -1 && direction.z == 0) return Math.PI;
    else if (direction.x == 0 && direction.z == -1) return Math.PI / 2;
  }

  createRoad = (x, z, rotate) => {
    let road = null;
    const position = { ...this.currentPosition };
    const direction = { ...this.direction };
    gltfLoader.load(
      '/models/Straight.glb',
      (gltf) =>
      {
        road = gltf;
        road.scene.scale.set(10, 5, 5);
        road.scene.position.set(x, 0.1, z);
        road.scene.rotateY(rotate);
        this.scene.add(road.scene);
        this.tracks.push({
          object: road,
          position,
          direction,
          shape: SHAPE.STRAIGHT,
          size: STRAIGHT_ROAD_LENGTH,
        });
      }
    )
  }

  createLeftCurve = (x, z, rotate) => {
    let curve = null;
    const position = { ...this.currentPosition };
    const direction = { ...this.direction };
    gltfLoader.load(
      '/models/roadCurve2.glb',
      (gltf) =>
      {
        curve = gltf;
        curve.scene.scale.set(5, 5, 5);
        curve.scene.position.set(x, 0.1, z);
        curve.scene.rotateY(rotate);
        this.scene.add(curve.scene);
        this.tracks.push({
          object: curve,
          position,
          direction,
          shape: SHAPE.LEFT_CURVE,
          size: CURVE_ROAD_LENGTH,
        });
      }
    )
  }

  createRightCurve = (x, z, rotate) => {
    let curve = null;
    const position = { ...this.currentPosition };
    const direction = { ...this.direction };
    gltfLoader.load(
      '/models/RCurve.glb',
      (gltf) =>
      {
        curve = gltf;
        curve.scene.scale.set(5, 5, 5);
        curve.scene.position.set(x, 0.1, z);
        curve.scene.rotateY(rotate);
        this.scene.add(curve.scene);
        this.tracks.push({
          object: curve,
          position,
          direction,
          shape: SHAPE.RIGHT_CURVE,
          size: CURVE_ROAD_LENGTH,
        });
      }
    )
  }

  removeLatestRoad = () => {
    console.log('remove');
    console.log(this.tracks);
    this.scene.remove(this.tracks[this.tracks.length - 1].object.scene)
    this.currentPosition = {...this.tracks[this.tracks.length - 1].position}
    this.direction = {...this.tracks[this.tracks.length - 1].direction}
    this.tracks.pop()
  }

  createNextStraightRoad = () => {
    this.createRoad(this.currentPosition.x, this.currentPosition.z,
        this.directionToAngle(this.direction));
    this.currentPosition.x += this.direction.x * STRAIGHT_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * STRAIGHT_ROAD_LENGTH;

    // console.log(this.currentPosition);
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

  createNextRightCurveRoad = () => {
    this.createRightCurve(this.currentPosition.x, this.currentPosition.z,
        this.directionToAngle(this.direction));

    this.currentPosition.x += this.direction.x * CURVE_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * CURVE_ROAD_LENGTH;

    this.direction = {
      x: -this.direction.z,
      z: this.direction.x,
    };

    this.currentPosition.x += this.direction.x * CURVE_ROAD_LENGTH;
    this.currentPosition.z += this.direction.z * CURVE_ROAD_LENGTH;
  }

  getTracks = () => {
    return this.tracks
  }
}
