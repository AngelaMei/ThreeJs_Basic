import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Model
 */
let bird = null

gltfLoader.load(
    'bird2.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.35, 0.35, 0.35)
        bird = gltf.scene
        bird.position.set(0.8, -0.7, 2)
        bird.rotateY(Math.PI* -0.25)
        bird.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)
    }
)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 2, 0)

directionalLight.castShadow = true
scene.add(directionalLight)

/**
 * Materials
 */
// Baked material
const bakedTexture = textureLoader.load('bakedagian.png')
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Window Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight * 0.9
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight * 0.9

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
camera.position.y = 0.8
cameraGroup.add(camera)

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0;

const birdTransform = [
    { positionX: 0.8, positionY: -0.7, positionZ: 2 , rotateY: Math.PI * -0.25, rotateX: 0},
    { positionX: -1.2, positionY: 0, positionZ: 2, rotateY: Math.PI * 0.25, rotateX: Math.PI * 0.25},
    { positionX:-0.1, positionY: 3, positionZ: 1.5, rotateY: Math.PI * 0, rotateX: Math.PI * 0 },
  ];

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height);

    if (newSection != currentSection){
        currentSection = newSection
        
        gsap.to(
            bird.position,{
                duration: 1.5,
                ease: 'power2.inOut',
                x: birdTransform[currentSection].positionX,
                y: birdTransform[currentSection].positionY,
                z: birdTransform[currentSection].positionZ
            }
        )

        gsap.to(
            bird.rotation,{
                duration: 1.5,
                ease: 'power2.inOut',
                y: birdTransform[currentSection].rotateY,
                x: birdTransform[currentSection].rotateX,
            }
        )

    }
});


/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

// window.addEventListener('mousemove', () => {
//     cursor.x = event.clientX / sizes.width - 0.5
//     cursor.y = event.clientY / sizes.height - 0.5
// })



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha: true,
    
})
renderer.setSize(sizes.width, sizes.height)
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

    // // Animate Object
    // for (const mesh of sectionMeshes){
    //     mesh.rotation.x += deltaTime * 0.2
    //     mesh.rotation.y += deltaTime * 0.4
    // }
    // Animate Camera
    // camera.position.y = - scrollY / sizes.height * objectDistance
    
    if (!!bird) {
        bird.position.y = Math.sin(elapsedTime * .5) * .1 - 0.8
    }


    const parallaxX = - cursor.x
    const parallaxY = cursor.y
    cameraGroup.position.x += ( parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += ( parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()