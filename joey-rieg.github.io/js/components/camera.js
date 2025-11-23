import * as THREE from "three/webgpu";

export function createCamera(position) {
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.copy(position);

    return camera;
}