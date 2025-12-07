import * as THREE from "three";

const clock = new THREE.Clock();

export function animate(renderer, camera, scene, postProcessing, interactionManager, controls = null) {
    renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();

        if (controls && controls.isEnabled) {
            controls.update(delta);
        }
        
        interactionManager.update();
        scene.traverse(obj => obj.update?.(delta));
        
        postProcessing.render();
    });
}