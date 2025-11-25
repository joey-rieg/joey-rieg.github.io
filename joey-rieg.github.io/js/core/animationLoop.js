import * as THREE from "three";
import {updatePhysicSync} from "./physicsSyncManager";

const clock = new THREE.Clock();

export function animate(renderer, camera, scene, postProcessing, interactionManager, world = null, controls = null) {
    renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();

        if (controls && controls.isEnabled) {
            controls.update(delta);
        }
        
        if (world) {
            world.step(1/60, delta, 3);

            updatePhysicSync();
        }
        
        interactionManager.update();
        scene.traverse(obj => obj.update?.(delta));
        
        postProcessing.render();
        //renderer.render(scene, camera);
    });
}