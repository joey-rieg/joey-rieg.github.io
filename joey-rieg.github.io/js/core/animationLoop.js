import * as THREE from "three";

let prevTime = performance.now();
const velocity = new THREE.Vector3(); // reuse for performance
const speed = 10; // units per second
const move = { forward: false, backward: false, left: false, right: false, up: false, down: false };

// Key events
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': move.forward = true; break;
        case 'KeyS': move.backward = true; break;
        case 'KeyA': move.left = true; break;
        case 'KeyD': move.right = true; break;
        case 'KeyQ': move.down = true; break;
        case 'KeyE': move.up = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': move.forward = false; break;
        case 'KeyS': move.backward = false; break;
        case 'KeyA': move.left = false; break;
        case 'KeyD': move.right = false; break;
        case 'KeyQ': move.down = false; break;
        case 'KeyE': move.up = false; break;
    }
});
export function animate(renderer, camera, controls, scene, postProcessing) {
    renderer.setAnimationLoop(() => {
        const time = performance.now();
        const delta = (time - prevTime) / 1000; // seconds
        prevTime = time;

        if (controls.isLocked) { // Move only when pointer is locked
            velocity.set(0, 0, 0);

            if (move.forward) velocity.z += speed * delta;
            if (move.backward) velocity.z -= speed * delta;
            if (move.left) velocity.x -= speed * delta;
            if (move.right) velocity.x += speed * delta;
            if (move.up) camera.position.y += speed * delta;
            if (move.down) camera.position.y -= speed * delta;

            // Apply movement relative to camera orientation
            controls.moveRight(velocity.x);
            controls.moveForward(velocity.z);
        }
        
        scene.traverse(obj => obj.update?.(delta));
        
        postProcessing.render();
    });
}