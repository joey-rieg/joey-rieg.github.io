import * as THREE from 'three/webgpu';
import {gsap} from 'gsap';
import {createPedestal} from '../components/pedestal';
import {createFloor} from '../components/floor';
import {makeInteractive} from "../utils/interactionUtils";

const NUM_PEDESTALS = 3;
const PEDESTAL_SPACING = 3;

export function initHubScene(scene) {
    let hubGroup = new THREE.Group();
    
    // Pedestals
    const color = 0x4b5320;
    const glowColor = 0xe8ff66;
    for (let i = 0; i < NUM_PEDESTALS; i++) {
        const pedestalPosition = getPedestalPosition(i, NUM_PEDESTALS, PEDESTAL_SPACING);
        const pedestal = createPedestal(pedestalPosition, color, glowColor, i);
        
        const artifactGeometry = new THREE.BoxGeometry(0.5, 0.5,0.5);
        const artifactMaterial = new THREE.MeshStandardMaterial({
            emissive: glowColor,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.5,
        })
        
        const artifact = new THREE.Mesh(artifactGeometry, artifactMaterial);
        artifact.name = 'Artifact-' + i;
        artifact.position.copy(pedestal.position);
        artifact.position.y = 2;
        artifact.rotation.x = Math.PI / 3 * i;
        
        //artifact.update = (dt) => artifact.rotation.x += dt;
        makeInteractive(
            artifact, {
            onHoverIn: () => gsap.to(artifact.scale, {x: 0.7, y: 0.7, z:0.7, duration: 0.25}),
            onHoverOut: () => gsap.to(artifact.scale, {x: 0.5, y: 0.5, z:0.5, duration: 0.25}),
            onClick: () => console.log('clicked')
        });
        
        hubGroup.add(pedestal);
        hubGroup.add(artifact);
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