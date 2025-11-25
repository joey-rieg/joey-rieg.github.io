import * as THREE from "three";

export async function createRenderer(containerId) {
    const container = document.querySelector(`.${containerId}`);
    const renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    
    // Wait for WebGPU backend to initialize
    //await renderer.init();

    // Attach dom element
    container.appendChild(renderer.domElement);

    return renderer;
}