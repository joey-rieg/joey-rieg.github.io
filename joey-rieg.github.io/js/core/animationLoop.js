export function animate(renderer, camera, scene, objects) {
    renderer.setAnimationLoop(() => {
        objects.cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    });
}