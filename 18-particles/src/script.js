import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleColorTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */

// Sphere
// const particleGeometrey = new THREE.SphereGeometry(1, 32, 32)


// Points Marterial
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // color: 'pink',
    sizeAttenuation: true,
    alphaMap: particleColorTexture,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

// Custom Geometry
const particleGeometrey = new THREE.BufferGeometry()
// We need particles
const count = 2000

// Set Position, Color Attribute
// // We need the x,y,z position array & RGB array
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

// // Random Generate Position: - 0.5 for positive and negative, * 10 for immersive
for (let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

// // Set the Arrtibute for the particles
particleGeometrey.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)

// // Set the Arrtibute for the particles
particleGeometrey.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)



// Points
const particles = new THREE.Points(particleGeometrey, particleMaterial)
scene.add(particles)

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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Particle Rotation
    // particles.rotation.y = - elapsedTime * 0.1

    // Do each Particle, but bad idea for performance
    // for (let i = 0; i < count; i++){
    //     const i3 = i * 3
    //     const x = particleGeometrey.attributes.position.array[i3 + 0]  // x value
    //     particleGeometrey.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) // y value
        
    // }
    // particleGeometrey.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()