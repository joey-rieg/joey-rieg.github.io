import * as THREE from "three/webgpu";

export function createPedestal(position, id) {
    const pedestalColor = 0x4b5320;
    const glowColor = 0xe8ff66;
    // Pedestal base
    const height = 0.5;
    const geometry = new THREE.CylinderGeometry(0.6, 0.8, height);
    const material = new THREE.MeshStandardMaterial({
        color: pedestalColor,
        metalness: 0.9,
        roughness: 0.5,
    });
    const pedestal = new THREE.Mesh(geometry, material);
    pedestal.castShadow = true;
    pedestal.name = `Pedestal-` + id;

    pedestal.position.copy(position);

    // Pedestal glow
    const glowHeight = 0.075
    const glowGeometry = new THREE.CylinderGeometry(0.8, 0.83, glowHeight);
    const glowMaterial = new THREE.MeshStandardMaterial({
        emissive: glowColor,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.5,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.name = `PedestalGlow-${id}`;

    glowMesh.position.y = -(0.5 * (height + glowHeight)); // half the height of the pedestal and half the height of the light
    glowMesh.castShadow = true;
    pedestal.add(glowMesh);

    // Pedestal light
    const pedestalSpotLight = new THREE.SpotLight(
        glowColor,
        1,
        0,
        Math.PI / 2,
        0.2);
    pedestalSpotLight.name = 'BaseLight';
    pedestalSpotLight.position.y = 0.25;
    const target = new THREE.Object3D();
    target.name = 'BaseLightTarget';
    target.position.set(0, 0, 0);
    pedestalSpotLight.target = target;

    pedestal.add(target);
    pedestal.add(pedestalSpotLight);

    return pedestal;
}
