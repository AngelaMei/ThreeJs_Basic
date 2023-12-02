import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import TWEEN from '@tweenjs/tween.js'
import GUI from 'lil-gui'

import { getPosition } from './position.js'
import TrackManager from './track.js'

/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}
debugObject.createRoad = () =>{createRoad(100, 0, Math.random()*20)}
debugObject.createCurve = () =>{createCurve(100, 0, Math.random()*20)}

gui.add(debugObject, 'createRoad')
gui.add(debugObject, 'createCurve')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new GLTFLoader()
let car = null

gltfLoader.load(
    '/models/RollerCoaster.glb',
    (gltf) =>
    {
        car = gltf
        scene.add(gltf.scene)
        car.rotation
    }
)


let mixer = null

const createTrees = () => {
    let tree = null
    gltfLoader.load(
        '/models/tree.glb',
        (gltf) =>
        {
            tree = gltf
            tree.scene.position.set(Math.random()-0.5 * 200, 0, Math.random()-0.5 * 200)
            const scale = Math.random() * 5
            tree.scene.scale.set(scale, scale, scale)
            scene.add(gltf.scene)

            mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[0])
            action.play()
        }
    )
}

createTrees()
createTrees()

const trackManager = new TrackManager(scene);

// trackManager.createRoad(0, 0, 0)
// trackManager.createRoad(-20, 0, 0)
// trackManager.createCurve(-40, 0, Math.PI)
// trackManager.createCurve(-55, 15, Math.PI * -0.5)
// trackManager.createRoad(-20, 30, 0)
// trackManager.createRoad(0, 30, 0)

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
    new THREE.CircleGeometry(200, 30),
    new THREE.MeshStandardMaterial({
        color: '#BDDDA3',
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
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
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
renderer.setClearColor('#C5FFFD')
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Upadte Car
    if (car !== null){
        // const positionX = Math.pow(2,elapsedTime) * Math.cos(elapsedTime)
        const position = getPosition(elapsedTime);
        car.scene.position.set(position.x, 0, position.y)
    }

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
