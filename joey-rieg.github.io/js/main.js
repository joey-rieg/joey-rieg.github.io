import * as THREE from 'three/webgpu';
import {createRenderer} from './core/renderer';
import {createCamera} from './core/camera';
import {createLights} from './core/lights';
import {initHubScene} from "./scenes/hubScene";
import {animate} from "./core/animationLoop";

window.initThree = async function(canvasId) {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = await createRenderer(canvasId);
    const objects = initHubScene(scene);
    const lights = createLights(scene);
    
    scene.add(new THREE.GridHelper(10, 10, 0x404040));
    
    animate(renderer, camera, scene, objects);

    setupResize(renderer, camera);
}

function setupResize(renderer, camera) {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}
