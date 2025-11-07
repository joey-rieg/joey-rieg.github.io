import * as THREE from 'three/webgpu';

export function initHubScene(scene) {
    let cubeGeometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshBasicMaterial();
    let cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.set(0, 1, 3);
    
    scene.add(cube);
    
    return {cube};
}