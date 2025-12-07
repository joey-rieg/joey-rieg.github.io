import * as THREE from 'three/webgpu';
import {pass} from "three/src/Three.TSL";
import {bloom} from "three/addons/tsl/display/BloomNode"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {initComingSoonScene} from './scenes/comingSoonScene.js';

const container = document.querySelector('div.webgl');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 1, 10);

// Controls
const controls = new OrbitControls(camera, container);
controls.enableDamping = true;

// Disable controls for now
controls.enabled = false;

// Meshes
initComingSoonScene(scene);

// Renderer
const renderer = new THREE.WebGPURenderer();
await renderer.init();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
container.appendChild(renderer.domElement);

// Post-processing
const postProcessing = new THREE.PostProcessing(renderer);
const scenePass = pass(scene, camera);
const scenePassColor = scenePass.getTextureNode('output');

const bloomPass = bloom(scenePassColor);
postProcessing.outputNode = scenePassColor.add(bloomPass);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

const clock = new THREE.Clock();
function animate() {
    controls.update();
    
    postProcessing.render(scene, camera);
    
    requestAnimationFrame(animate);
}

animate();
