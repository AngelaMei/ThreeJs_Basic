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
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const roofColorTexture = textureLoader.load('/textures/roof/color.jpg')
const roofAmbientOcclusionTexture = textureLoader.load('/textures/roof/ambientOcclusion.jpg')
const roofNormalTexture = textureLoader.load('/textures/roof/normal.jpg')
const roofRoughnessTexture = textureLoader.load('/textures/roof/roughness.jpg')
const roofMetalnessTexture = textureLoader.load('/textures/roof/metalness.jpg')
const roofHeightTexture = textureLoader.load('/textures/roof/height.jpg')


const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')


grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

roofColorTexture.repeat.set(6, 6)
roofAmbientOcclusionTexture.repeat.set(6, 6)
roofNormalTexture.repeat.set(6, 6)
roofRoughnessTexture.repeat.set(6, 6)
roofMetalnessTexture.repeat.set(6, 6)
roofHeightTexture.repeat.set(6, 6)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
roofRoughnessTexture.wrapS = THREE.RepeatWrapping
roofMetalnessTexture.wrapS = THREE.RepeatWrapping
roofHeightTexture.wrapS = THREE.RepeatWrapping

roofColorTexture.wrapT = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
roofNormalTexture.wrapT = THREE.RepeatWrapping
roofRoughnessTexture.wrapT = THREE.RepeatWrapping
roofMetalnessTexture.wrapT = THREE.RepeatWrapping
roofHeightTexture.wrapT = THREE.RepeatWrapping


/**
 * House
 */
// Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.position.y = 2.5 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 3, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofAmbientOcclusionTexture,
        displacementMap: roofHeightTexture,
        displacementScale: 0.1,
        normalMap: roofNormalTexture,
        metalnessMap: roofMetalnessTexture,
        roughnessMap: roofRoughnessTexture
    })
)
roof.position.y = 3.5 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterail = new THREE.MeshStandardMaterial({ color: '#89c854'})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterail)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterail)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterail)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.9, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterail)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1.2, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// Grave Group
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1'})

for (let i = 0 ; i < 50; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set( x, 0.3, z)
    grave.rotation.z = (Math.random() - 0.8) * 0.4
    grave.rotation.y = (Math.random() - 0.6) * 0.4
    graves.add(grave)
    grave.castShadow = true
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Ghost
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.25)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.15)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Shadow
 */
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

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
camera.position.x = 4
camera.position.y = 3
camera.position.z = 6
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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Ghost Move
    const ghostAngle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghostAngle) * 4
    ghost1.position.z = Math.sin(ghostAngle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)
    
    const ghostAngle2 = elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghostAngle2) * - 5
    ghost2.position.z = Math.sin(ghostAngle2) * 5
    ghost2.position.y = Math.sin(elapsedTime * 2)

    const ghostAngle3 = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime) * 3.2)
    ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime) * 0.5)
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()