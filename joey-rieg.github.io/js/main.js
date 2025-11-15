import * as THREE from 'three/webgpu';
import {pass} from "three/src/Three.TSL";
import {bloom} from "three/addons/tsl/display/BloomNode"
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {createRenderer} from './components/renderer';
import {createCamera} from './components/camera';
import {createLights} from './components/lights';
import {initHubScene} from "./scenes/hubScene";
import {animate} from "./core/animationLoop";
import {InteractionManager} from "./core/interactionManager";
import {Controls} from './utils/controls';

// Will be thrown out by tree shaking in production
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {createSceneGUI} from './utils/gui';

window.initThree = async function (canvasId, isDev) {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = await createRenderer(canvasId);
    const hubGroup = initHubScene(scene);
    const lights = createLights(scene);
    scene.add(new THREE.GridHelper(10, 10, 0x404040));
    scene.background = new THREE.Color(0x000000);

    // PostProcessing
    const postProcessing = new THREE.PostProcessing(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');

    const bloomPass = bloom(scenePassColor);
    postProcessing.outputNode = scenePassColor.add(bloomPass);

    // Setup controls
    const controls = new Controls(camera, renderer.domElement)

    // Setup interactions
    const interactionManager = new InteractionManager(camera, renderer);
    interactionManager.registerSceneObjects(scene);

    // Add Helper UI only in dev environment
    if (isDev) {
        const gui = new GUI();
        createSceneGUI(scene, gui);
    }

    animate(renderer, camera, controls, scene, postProcessing, interactionManager);

    setupResize(renderer, camera);
}

function setupResize(renderer, camera) {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}
