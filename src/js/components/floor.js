import * as THREE from "three/webgpu";

export function createFloor() {
    const getPath = (texture) => `textures/concrete/Concrete-${texture}.jpg`;
    console.log(getPath('Albedo'));
    const textureLoader = new THREE.TextureLoader();
    const floorColor = textureLoader.load(getPath('Albedo'));
    const floorNormal = textureLoader.load(getPath('NormalGL'));
    const floorDisplacement = textureLoader.load(getPath('Displacement'));
    const floorMetalness = textureLoader.load(getPath('Metalness'));
    const floorRoughness = textureLoader.load(getPath('Roughness'));
    const floorAO = textureLoader.load(getPath('AO'));

    [floorColor, floorNormal, floorDisplacement, floorMetalness, floorRoughness, floorAO].forEach(t => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(6, 6);
    });

    let geometry = new THREE.PlaneGeometry(40, 40);
    let material = new THREE.MeshStandardMaterial({
        map: floorColor,
        normalMap: floorNormal,
        displacementMap: floorDisplacement,
        roughnessMap: floorRoughness,
        metalnessMap: floorMetalness,
        ambientMap: floorAO,
        metalness: 0.1,
        roughness: 0.7,
        displacementScale: 0.5
    });

    let floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI/2;

    return floor;
}