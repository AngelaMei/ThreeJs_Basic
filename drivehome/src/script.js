import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import TWEEN from '@tweenjs/tween.js'
import GUI from 'lil-gui'

import { getPosition } from './position.js'
import TrackManager from './track.js'

/**
 * Color
 */
// const backgroundColor = '#F4D8DA'
const backgroundColor = '#7AC9FB'


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
        car.rotation
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
camera.position.set(- 10, 30, 30)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
camera.position.set( 0, 20, 50 )
controls.maxDistance = 200
controls.maxPolarAngle = [ Math.PI * 0.5 - 0.1]
controls.enableDamping = true

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
 * Animate
 */
const clock = new THREE.Clock()
const carClock = new THREE.Clock()
let previousTime = 0

const goButton = document.getElementById("car_go")

const carButtonSwitcher = () => {
    if (goButton.textContent == "Car Go"){
        goButton.textContent = "Car Stop"
        console.log("Car start");
    } else {
        goButton.textContent = "Car Go"
        console.log("Car stop");
    }
}

const carAction = () => {
    let startRun = carClock.getElapsedTime()
    const position = getPosition(trackManager, startRun)
    car.scene.position.set(position.x, 0, position.z)

    if (goButton.textContent == "Car Stop"){
        window.requestAnimationFrame(carAction)
    }
}

goButton.addEventListener('click', () =>{
    if (goButton.textContent == "Car Go"){
        carButtonSwitcher()
        carAction()
    } else {
        carButtonSwitcher()
    }
});


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // // Upadte Car
    // if (car !== null){
    //     // const positionX = Math.pow(2,elapsedTime) * Math.cos(elapsedTime)
    //     const position = getPosition(trackManager, elapsedTime)
    //     car.scene.position.set(position.x, 0, position.z)
    // }
    


    // Update mixer
    if (mixer !== null){
        mixer.update(deltaTime*1.5)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
