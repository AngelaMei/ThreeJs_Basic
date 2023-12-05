import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap";
import GUI from 'lil-gui'

import { getPosition } from './position.js'
import TrackManager from './track.js'

/**
 * Color
 */
// const backgroundColor = '#F4D8DA'
const backgroundColor = '#7AC9FB'

/**
 * Sound
 */
const backgroundMusic = new Audio('sound/background.mp3')
// backgroundMusic.play()


/**
 * Base
 */
// Debug
// const gui = new GUI()
// const debugObject = {}
// debugObject.createRoad = () =>{createRoad(100, 0, Math.random()*20)}
// debugObject.createCurve = () =>{createCurve(100, 0, Math.random()*20)}

// gui.add(debugObject, 'createRoad')
// gui.add(debugObject, 'createCurve')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// const fog = new THREE.Fog(backgroundColor, 0.1, 300)
// scene.fog = fog

/**
 * Models
 */
const gltfLoader = new GLTFLoader()
let car = null

gltfLoader.load(
    '/models/car.glb',
    (gltf) =>
    {
        car = gltf
        scene.add(gltf.scene)
        // car.scene.rotateY(Math.PI* -0.5)
        // console.log(car);
    }
)

let mountain = null
let mixer = null

gltfLoader.load(
    '/models/mountain.glb',
    (gltf) =>
    {
        mountain = gltf
        mountain.scene.scale.set(5,5,5)
        scene.add(mountain.scene)

        mixer = new THREE.AnimationMixer(gltf.scene)
        for (let i = 0; i < mountain.animations.length; i++){
            const action = mixer.clipAction(gltf.animations[i])
            action.play()
        }
    }
)


const trackManager = new TrackManager(scene);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const roadAmbientOcclusionTexture = textureLoader.load('/textures/road/Road_001_ambientOcclusion.jpg')
const roadColorTexture = textureLoader.load('/textures/road/Road_001_basecolor.jpg')
const roadNormalTexture = textureLoader.load('/textures/road/Road_001_normal.jpg')
const roadRoughnessTexture = textureLoader.load('/textures/road/Road_001_roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass.jpg')

grassColorTexture.repeat.set(50, 50)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping

roadAmbientOcclusionTexture.rotation = 2
roadColorTexture.rotation = Math.PI
roadNormalTexture.rotation = Math.PI
roadRoughnessTexture.rotation = Math.PI


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.CircleGeometry(180, 30),
    new THREE.MeshStandardMaterial({
        color: '#DDE5B6',
        roughness: 1,
        map: grassColorTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(2048, 2048)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(2048, 2048)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(10, 5, -10)
scene.add(directionalLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(30, 15, 30)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.maxDistance = 200
controls.maxPolarAngle = [ Math.PI * 0.5 - 0.1]
controls.enableDamping = true

// cameraSwitcher
const cameraOptions = {
    wholeView: 0,
    carSide: 1,
    carFront: 2,
    carBack:3,
}

let cameraChoice = cameraOptions.wholeView

const cameraSwitch = (position) => {
    if (cameraChoice == 1){
        controls.target.set(position.x, 5, position.z)
        camera.position.set(position.x + 15, 10, position.z +15)
    } else if (cameraChoice == 2){
        camera.position.set(position.x, 5, position.z)
        controls.target.set(position.x + 5 * Math.cos(position.y), 5, position.z - 5 * Math.sin(position.y))
    } else if (cameraChoice == 3){
        controls.target.set(position.x, 5, position.z)
        camera.position.set(position.x - 10 * Math.cos(position.y), 
                        5,
                        position.z + 10 * Math.sin(position.y))
    } else if (cameraChoice == 0) {
        controls.target.set(0, 0, 0)
    }
}

// Intro Camera
const introAnimation = () => {
    controls.enabled = false //disable orbit controls to animate the camera
    gsap.fromTo(camera.position, {x: 50, y: 100, z: 50}, {x: 15, y: 10, z: 15, duration: 2.5, delay: 0.8, ease: "power4.out"})
    controls.enabled = true //enable orbit controls
}

//introAnimation()

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(backgroundColor)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Button
*/

const clock = new THREE.Clock()
let previousTime = 0

const carClock = new THREE.Clock()
let isCarAtStartPoint = true;
let timeNotMoving = 0;
let carRun = false;

const cameraSwitcher = document.querySelector('.switcher'); 
const cameraButtons = cameraSwitcher.querySelectorAll('.switch');
const defaultCamera = document.querySelector('#camera_1'); 
const roadButtons = document.querySelectorAll('.roadButton');
const goButton = document.querySelector("#car_go");
const carStartSound = new Audio('sound/carHorn.m4a');

goButton.addEventListener('click', () =>{
    if (carRun === false){
        cameraChoice = cameraOptions.carSide;
        goButton.src="icon/Road_7.png";
        carStartSound.play();

        cameraButtons.forEach(button => {
            button.classList.remove('inactive');
        });
        roadButtons.forEach(button => {
            button.classList.add('inactive');
        });

        if (isCarAtStartPoint) {
            isCarAtStartPoint = false;
            carClock.start();
        } else {
            timeNotMoving += carClock.getDelta();
        }
        // Start car
        carRun = true;
    } else {
        carRun = false;
        // cameraChoice = cameraOptions.wholeView
        // camera.position.set(40, 25, 40)
        goButton.src="icon/Road_4.png";

        cameraButtons.forEach(button => {
            button.classList.add('inactive');
            button.classList.remove('active');
        });
        defaultCamera.classList.add('active')

        roadButtons.forEach(button => {
            button.classList.remove('inactive');
        });
    }
});


cameraSwitcher.addEventListener('click', (event) => {
    const clickedButton = event.target.parentElement;
    cameraButtons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    cameraChoice = event.target.parentElement.id.substr(-1);
});

/**
 * Other Animate
 */

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null){
        mixer.update(deltaTime*1.5)
    }

    // Car Animate
    if (car !== null && carRun === true){
        const timeSinceStart = carClock.getElapsedTime() - timeNotMoving;
        const position = getPosition(trackManager, timeSinceStart)
        //carClock.running = true
        car.scene.position.set(position.x, 0, position.z)
        car.scene.rotation.y = position.y
        cameraSwitch(position);
    } else {
        //carClock.running = false
    }



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

document.addEventListener('DOMContentLoaded', () => {
    const loading = document.querySelector('#loading')
    loading.classList.add('inactive')
});

tick()
