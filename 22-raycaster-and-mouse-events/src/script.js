import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)
const directionLight = new THREE.DirectionalLight('#ffffff', 0.7)
directionLight.position.set(1, 2, 3)
scene.add(directionLight)


/**
 * Model
 */
let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb', 
    (gltf)=>{
        model = gltf.scene
        model.position.y = - 1.2
        scene.add(model)
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()


// Basic
// const rayOrigin = new THREE.Vector3(-3, 0, 0) 
// const rayDirection = new THREE.Vector3(10, 0, 0) // Has to be standardlize
// rayDirection.normalize() // make the length to 1, but same direction

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects);


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
 * Mouse
 */
const mouse = new THREE.Vector2() // Just x & y

window.addEventListener('mousemove', (event)=>{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - event.clientY / sizes.height * 2 + 1
})

window.addEventListener('click', ()=>{
    if(currentIntersect){
        if(currentIntersect.object === object1){
            console.log('click object1');
        } else if (currentIntersect.object === object2){
            console.log('click object2');
        } else if (currentIntersect.object === object3){
            console.log('click object3');
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Object

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.cos(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // cast a ray
    raycaster.setFromCamera(mouse, camera)

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest){
        object.material.color.set('#ff0000')
    }

    for (const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
    }

    // mouse Enter check
    if (intersects.length){
        if (currentIntersect === null){
            console.log('mouse enter');
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect){
            console.log('mouse leave');
        }
        currentIntersect = null
    }

    // mouse with model
    if (model){
        const modelIntersects = raycaster.intersectObject(model)
        if (modelIntersects.length > 0){
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
    }
    


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()