import * as THREE from "three";
import {isWebGpuAvailable} from "../utils/webGpuCheck";

export async function createRenderer(containerId) {
    const container = document.querySelector(`.${containerId}`);
    
    let renderer;
    const isAvailable = await isWebGpuAvailable();
    if (isAvailable){
        const THREE_WEBGPU = await import('three/webgpu');
        renderer = new THREE_WEBGPU.WebGPURenderer({ antialias: true});
    }
    else
    {
        renderer = new THREE.WebGLRenderer({ antialias: true });
    }
    
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    
    // Wait for WebGPU backend to initialize
    if(isAvailable) {
        await renderer.init();    
    }

    console.log(`Renderer is ${renderer}`);

    // Attach dom element
    container.appendChild(renderer.domElement);

    return renderer;
}