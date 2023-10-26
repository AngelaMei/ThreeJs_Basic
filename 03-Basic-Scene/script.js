// Ceate a scene: objet, camera, renderer

const scene = new THREE.Scene();

// Create a Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Create a Camera
// PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
// fov: degree; 
// aspect: width/height;

const sizes = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, );
// Move camera from defaut position
camera.position.z = 3;
// camera.position.x = 2;
scene.add(camera);


// Renderer
const canvas = document.querySelector('.webgl');
console.log(canvas);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene,camera);

// Move the Camera
