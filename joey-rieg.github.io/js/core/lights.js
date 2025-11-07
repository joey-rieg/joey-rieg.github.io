import * as THREE from 'three/webgpu';

export function createLights() {
    let light = new THREE.SpotLight(0xffffff, .75, 5, Math.PI/2, .1,);
    
    return light;
}