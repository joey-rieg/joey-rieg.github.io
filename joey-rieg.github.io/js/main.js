import * as THREE from 'three/webgpu';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {createRenderer} from './core/renderer';
import {createCamera} from './core/camera';
import {createLights} from './core/lights';
import {initHubScene} from "./scenes/hubScene";
import {animate} from "./core/animationLoop";

window.initThree = async function(canvasId) {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = await createRenderer(canvasId);
    const hubGroup = initHubScene(scene);
    const lights = createLights(scene);
    scene.add(new THREE.GridHelper(10, 10, 0x404040));
    
    const controls = configureControls(camera, renderer.domElement);
    
    animate(renderer, camera, controls, scene);

    setupResize(renderer, camera, controls);
}

function setupResize(renderer, camera, controls) {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

function configureControls(camera, domElement) {
    let controls = new PointerLockControls(camera, domElement);
    controls.isLocked = true;

    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyP') {
            controls.lock();
        }
    });
    
    return controls;
}
