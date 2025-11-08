import * as THREE from 'three/webgpu';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {createRenderer} from './core/renderer';
import {createCamera} from './core/camera';
import {createLights} from './core/lights';
import {initHubScene} from "./scenes/hubScene";
import {animate} from "./core/animationLoop";

// Will be thrown out by tree shaking in production
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {createSceneGUI} from './utils/gui';

window.initThree = async function(canvasId, isDev) {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = await createRenderer(canvasId);
    const hubGroup = initHubScene(scene);
    const lights = createLights(scene);
    scene.add(new THREE.GridHelper(10, 10, 0x404040));
    
    const controls = configureControls(camera, renderer.domElement);
    
    // Add Helper UI only in dev environment
    console.log("Is Dev: " + isDev);
    if (isDev) {
        const gui = new GUI();
        createSceneGUI(scene, gui);
    }
    
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
