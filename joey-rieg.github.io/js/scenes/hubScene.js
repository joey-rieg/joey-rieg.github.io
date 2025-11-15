import * as THREE from 'three/webgpu';
import {createPedestal} from '../components/pedestal';
import {createFloor} from '../components/floor';

const NUM_PEDESTALS = 3;
const PEDESTAL_SPACING = 3;

export function initHubScene(scene) {
    let hubGroup = new THREE.Group();
    for (let i = 0; i < NUM_PEDESTALS; i++) {
        //let pedestal = createPedestal(i, NUM_PEDESTALS, PEDESTAL_SPACING);
        const pedestalPosition = getPedestalPosition(i, NUM_PEDESTALS, PEDESTAL_SPACING);
        const pedestal = createPedestal(pedestalPosition, i);
        hubGroup.add(pedestal);
    }
    
    hubGroup.add(createFloor());
    const light = createKeyLight();
    hubGroup.add(light);
    
    scene.add(hubGroup);
    
    return {hubGroup};
}

function createKeyLight()
{
    const keyLight = new THREE.SpotLight(
        0xa0a0a0,
        100,
        20,
        Math.PI/3,
        0.2);
    
    keyLight.position.set(0, 10, -10);
    keyLight.target.position.set(0,0,0);

    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0005; // tweak to reduce acne
    
    return keyLight
}

function getPedestalPosition(id, numPedestals, spacing)
{
    return new THREE.Vector3((id - (numPedestals-1)/2.0) * spacing, 1, 0);
}