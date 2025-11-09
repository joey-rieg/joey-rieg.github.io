import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as THREE from 'three';

/**
 * Automatically generates a GUI hierarchy for a Three.js scene object.
 * @param {THREE.Object3D} object The starting object (e.g., your scene or a specific group).
 * @param {GUI} gui The root GUI or folder to attach ui objects to
 */
export function createSceneGUI(object, gui) {
    
    // Start by creating a folder for the current object
    const folder = gui.addFolder(object.name || object.type);

    // 1. Add common transform properties
    folder.add(object.position, 'x', -10, 10).name('Position X');
    folder.add(object.position, 'y', -10, 10).name('Position Y');
    folder.add(object.position, 'z', -10, 10).name('Position Z');
    folder.add(object, 'visible', true).name('Visible');
    
    // 2. Add material properties if the object has a mesh and material
    if (object instanceof THREE.Mesh && object.material) {
        const material = object.material;
        const materialFolder = folder.addFolder('Material');

        // Handle single material
        if (!(material instanceof Array)) {
            addMaterialControls(materialFolder, material);
        }
        // Handle multi-materials (array of materials)
        else {
            material.forEach((mat, index) => {
                const subMaterialFolder = materialFolder.addFolder(`Material ${index}`);
                addMaterialControls(subMaterialFolder, mat);
            });
        }
        
        folder.open(false);
    }
    
    // 3. Add light properties
    if (object instanceof THREE.Light) {
        const lightFolder = folder.addFolder('Light');
        addLightControls(lightFolder, object);
    }

    // 4. Recursively call this function for all children
    object.children.forEach(child => {
        createSceneGUI(child, folder); // Pass the current folder as the new parent GUI
    });
}

// Helper function to add standard material controls
function addMaterialControls(guiFolder, material) {
    guiFolder.addColor({ color: '#' + material.color.getHexString() }, 'color')
        .onChange(value => material.color.set(value));


    if ('emissive' in material){
        guiFolder.addColor({ emissive: '#' + material.emissive.getHexString() }, 'emissive')
            .onChange(value => material.emissive.set(value));
    }
    
    if ('anisotropy' in material) guiFolder.add(material, 'anisotropy', 0, 1);
    if ('roughness' in material) guiFolder.add(material, 'roughness', 0, 1);
    if ('metalness' in material) guiFolder.add(material, 'metalness', 0, 1);
    
    guiFolder.add(material, 'wireframe');
}

function addLightControls(guiFolder, light) {
    guiFolder.addColor({color: '#' + light.color.getHexString() }, 'color')
        .onChange(value => light.color.set(value));
    guiFolder.add(light, 'intensity', 0, 1000);
}
