import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

console.log(dat);

/**
 * Debug
 */
const gui = new dat.GUI()
const parameters = {
    color: 0xff0000,
    spin: () =>{
        gsap.to(mesh.rotation, {y: mesh.rotation.y + 10 , duration: 1})
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
// const geometry = new THREE.BufferGeometry()
// const count = 100
// const positionsArray = new Float32Array(count * 3 * 3)

// for (let i = 0; i < count * 3 * 3; i++){
//     positionsArray[i] = (Math.random() - 0.5)*4
// }

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionsAttribute)



// // Vertice 1
// positionsArray[0] = 0
// positionsArray[1] = 0
// positionsArray[2] = 0
// // Vertice 2
// positionsArray[3] = 0
// positionsArray[4] = 1
// positionsArray[5] = 0
// // Vertice 3
// positionsArray[6] = 1
// positionsArray[7] = 0
// positionsArray[8] = 0

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ 
    color: parameters.color,
    wireframe: false
 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Textures : Follow PBR priciples - metalness and roughness > get realistic results for realistic results



// Debug
gui
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01) //chaining the method
    .name('elevation')

gui
    .add(mesh, 'visible') 

gui
    .add(material, 'wireframe')

gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })
gui
    .add(parameters,'spin')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement){
        if(canvas.requestFullscreen){
            canvas.requestFullscreen()
        } else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
        
    } else {
        if(document.exitFullscree){
            document.exitFullscreen()
        } else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen()
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()