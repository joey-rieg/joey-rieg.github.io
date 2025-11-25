import * as THREE from 'three';
import {createRenderer} from './components/renderer';
import {createCamera} from './components/camera';
import {createLights} from './components/lights';
import {initHubScene} from "./scenes/hubScene";
import {initComingSoonScene} from "./scenes/comingSoonScene";
import {animate} from "./core/animationLoop";
import {InteractionManager} from "./core/interactionManager";
import {initPostProcessing} from "./core/postProcessing";
import {Controls} from './utils/controls';

// Will be thrown out by tree shaking in production
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {createSceneGUI} from './utils/gui';

window.initComingSoon = async function(canvasId, isDev)
{
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.log("Couldn't request WebGPU Adapter");
    }
    else {
        console.log(`Running WebGPU with ${adapter.info.architecture}`);
    }
    const scene = new THREE.Scene();
    const camera = createCamera(new THREE.Vector3(0,1,10));
    const renderer = await createRenderer(canvasId);
    renderer.setPixelRatio(window.devicePixelRatio);
    initComingSoonScene(scene, camera, renderer.domElement);
    scene.background = new THREE.Color(0x000000);
    
    // PostProcessing
    const postProcessing = await initPostProcessing(renderer, scene, camera); 
    postProcessing.addBloom();

    // Setup interactions   
    const interactionManager = new InteractionManager(camera, renderer);
    interactionManager.registerSceneObjects(scene);

    animate(renderer, camera, scene, postProcessing, interactionManager);

    setupResize(renderer, camera);
}

window.initThree = async function (canvasId, isDev) {
    const scene = new THREE.Scene();
    const camera = createCamera(new THREE.Vector3(0, 1.5, 5));
    const renderer = await createRenderer(canvasId);
    const hubGroup = initHubScene(scene);
    const lights = createLights(scene);
    scene.add(new THREE.GridHelper(10, 10, 0x404040));
    scene.background = new THREE.Color(0x000000);

    // PostProcessing
    // const postProcessing = new THREE.PostProcessing(renderer);
    // const scenePass = pass(scene, camera);
    // const scenePassColor = scenePass.getTextureNode('output');
    //
    // const bloomPass = bloom(scenePassColor);
    // postProcessing.outputNode = scenePassColor.add(bloomPass);

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

    animate(renderer, camera, scene, postProcessing, interactionManager, controls);

    setupResize(renderer, camera);
}

function setupResize(renderer, camera) {
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

