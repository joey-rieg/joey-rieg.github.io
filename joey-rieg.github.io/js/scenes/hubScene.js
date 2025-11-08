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
    const geometry = new THREE.CylinderGeometry(1, 1, 0.3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4b5320,
        metalness: 0.8,
        roughness: 0.4,
    });
    const pedestal = new THREE.Mesh(geometry, material);

    pedestal.position.copy(getPedestalPosition(id, numPedestals, spacing));
    
    return pedestal;
}

function createFloor() {
    let geometry = new THREE.PlaneGeometry(20, 20);
    let material = new THREE.MeshBasicMaterial();
    
    let floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI/2;
    
    return floor;
}

function createLights(numPedestals, spacing)
{
    let lights = []
    for (let i = 0; i < numPedestals; i++) {
        const light = new THREE.SpotLight(0xffffff, 10, 5, Math.PI/2, .1,);
        let lightPosition = getPedestalPosition(i, numPedestals, spacing);
        lightPosition.y = 4;
        light.position.copy(lightPosition);
        lights.push(light);


        // const gui = new GUI();
        // const lightFolder = gui.addFolder('Lights');
        // const folder = lightFolder.addFolder(`Light${i}`);
        // folder.add(light.position, 'x', -10, 10);
        // folder.add(light.position, 'y', -10, 10);
        // folder.add(light.position, 'z', -10, 10);
        // folder.add(light, 'intensity', 0, 30);
        // folder.add(light, 'angle', -Math.PI/2, Math.PI/2);
        // folder.add(light, 'distance', 1, 20);
        // folder.add(light, 'penumbra', .1, 5);
        // gui.addColor(light, 'color').onChange(function(value) {
        //     // 'value' is the hex string from the color picker
        //     light.color.set(value);
        // });
    }
    
    return lights;
}

function getPedestalPosition(id, numPedestals, spacing)
{
    return new THREE.Vector3((id - (numPedestals-1)/2.0) * spacing, 0, 0);
}