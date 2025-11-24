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
        
        const hoverHitBoxGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2);
        const hoverHitBoxMaterial = new THREE.MeshBasicMaterial({visible: false});
        const hoverHitBox = new THREE.Mesh(hoverHitBoxGeometry, hoverHitBoxMaterial);
        hoverHitBox.name = 'HitBox-' + i;
        hoverHitBox.position.copy(pedestal.position);
        hoverHitBox.position.y = 1.8;
        
        
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
            hoverHitBox, {
            onHoverIn: () => {
                gsap.to(artifact.position, {y: 2.5, duration: 0.25});
                gsap.to(artifact.rotation, {x: toRadians(15), y: toRadians(20), z: 0, duration: 0.25});
                gsap.to(artifact.scale, {x: 1.15, y: 1.15, z: 1.15, duration: 0.25});
            },
            onHoverOut: () => {
                gsap.to(artifact.position, {y: 2, duration: 0.25});
                gsap.to(artifact.rotation, {x: 0, y: 0, z: 0, duration: 0.25});
                gsap.to(artifact.scale, {x: 1, y: 1, z: 1, duration: 0.25});
            },
            onClick: () => console.log('clicked')
        });
        
        hubGroup.add(hoverHitBox);
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

function toRadians(degrees) { return degrees * Math.PI / 180 }
