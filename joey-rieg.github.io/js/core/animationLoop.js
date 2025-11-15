import * as THREE from "three";

let prevTime = performance.now();

export function animate(renderer, camera, controls, scene, postProcessing, interactionManager) {
    renderer.setAnimationLoop(() => {
        const time = performance.now();
        const delta = (time - prevTime) / 1000; // seconds
        prevTime = time;
        
        if (!controls.isEnabled) {
            controls.update(delta, scene);
        }
        
        
        interactionManager.update();
        scene.traverse(obj => obj.update?.(delta));
        
        postProcessing.render();
    });
}