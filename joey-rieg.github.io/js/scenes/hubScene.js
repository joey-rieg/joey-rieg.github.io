import * as THREE from 'three/webgpu';

export function initHubScene(scene) {
    let numPedastals = 3;
    let hubGroup = new THREE.Group();
    for (let i = 0; i < numPedastals; i++) {
        let pedastal = createPedastal(i, numPedastals);
        hubGroup.add(pedastal);
    }
    
    scene.add(hubGroup);
    
    return {hubGroup};
}

function createPedastal(id, numPedastals) {
    let geometry = new THREE.CylinderGeometry(1, 1, 0.3);
    let material = new THREE.MeshBasicMaterial();
    let pedastal = new THREE.Mesh(geometry, material);
    
    // position = i * spacing - midPoint
    let position = id * 1.5 - numPedastals/2.0;
    pedastal.position.set(position, 0, 0);
    
    return pedastal;
}