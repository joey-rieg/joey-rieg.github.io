import * as THREE from "three/webgpu";

export async function createRenderer(containerId) {
    const container = document.querySelector(`.${containerId}`);
    const renderer = new THREE.WebGPURenderer({ antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Wait for WebGPU backend to initialize
    await renderer.init();

    // Attach dom element
    container.appendChild(renderer.domElement);

    return renderer;
}