import * as THREE from 'three/webgpu';

const NUM_PEDESTALS = 3;
const PEDESTAL_SPACING = 3;

export function initHubScene(scene) {
    let hubGroup = new THREE.Group();
    for (let i = 0; i < NUM_PEDESTALS; i++) {
        let pedestal = createPedestal(i, NUM_PEDESTALS, PEDESTAL_SPACING);
        hubGroup.add(pedestal);
    }
    
    hubGroup.add(createFloor());
    const lights = createLights(NUM_PEDESTALS, PEDESTAL_SPACING);
    lights.forEach(light => hubGroup.add(light));
    
    scene.add(hubGroup);
    
    return {hubGroup};
}

function createPedestal(id, numPedestals, spacing) {
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
    pedestal.name = `Pedestal-` + id;

    pedestal.position.copy(getPedestalPosition(id, numPedestals, spacing));
    
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
    
    glowMesh.position.y = -(0.5*(height + glowHeight)); // half the height of the pedestal and half the height of the light
    pedestal.add(glowMesh);
    
    // Pedestal light
    const pedestalSpotLight = new THREE.SpotLight(
        glowColor,
        1,
        0,
        Math.PI/2,
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

function createFloor() {
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
    floor.rotation.x = -Math.PI/2;
    
    return floor;
}

function createLights(numPedestals, spacing)
{
    let lights = []
    // for (let i = 0; i < numPedestals; i++) {
    //     const light = new THREE.SpotLight(0xff0000, 10, 5, Math.PI/2, .1,);
    //     light.name = `PedestalSpotLight-` + i;
    //     let lightPosition = getPedestalPosition(i, numPedestals, spacing);
    //     lightPosition.y = 4;
    //     light.position.copy(lightPosition);
    //     lights.push(light);
    // }
    //
    const keyLight = new THREE.SpotLight(
        0xa0a0a0,
        100,
        20,
        Math.PI/3,
        0.2);
    
    keyLight.position.set(0, 10, -10);
    keyLight.target.position.set(0,0,0);
    
    lights.push(keyLight);
    
    return lights;
}

function getPedestalPosition(id, numPedestals, spacing)
{
    return new THREE.Vector3((id - (numPedestals-1)/2.0) * spacing, 1, 0);
}