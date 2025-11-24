import * as THREE from 'three';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Flicker} from "../utils/flicker";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";
import {palette} from "../utils/colorPalette";


const Resources = {font: undefined};
const textGlowColor = palette.lightTeal;
const targetText = "Under construction ...";
const typingSpeed = 75; // milliseconds per character
const additionalTextShift = 8;

let initScene;
let textMesh;
let startTextPosition = new THREE.Vector3(); // Will be calculated dynamically
let flicker = new Flicker();

// Text properties
const finalTextCenterPoint = new THREE.Vector3(0, 1, 7.7);
const textOptions = {
    size: 0.1,
    depth: 0.001,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 1,
    
};

// Room properties
const roomProperties = {
    length: 20,
    width: 15,
    height: 5,
    slabThickness: 1,
    lightToWallOffset: 2
}

const lightProperties = {
    tubeColor: new THREE.Color(palette.lightOrange),
    lightsPerTube: 16,
    tubeRadius: 0.05,
    tubeIntensity: 0.1
}
export function initComingSoonScene(scene, camera, domElement, world) {
    initScene = scene;
    setupRoom();
    setupLighting();

    //flicker.startFlicker();
    setupTypewriter(targetText, textGlowColor);
}

function setupRoom() {
    // Load textures
    const texLoader = new THREE.TextureLoader();
    const textures = {
        diffuse: texLoader.load('textures/concrete/concrete_layers_diff_2k.png'),
        normal : texLoader.load('textures/concrete/concrete_layers_nor_gl_2k.png'),
        arm : texLoader.load('textures/concrete/concrete_layers_arm_2k.png'),
        displace : texLoader.load('textures/concrete/concrete_layers_disp_2k.png')
    };

    const textureValues = Object.values(textures);
    textureValues.forEach((texture) => { 
        texture.wrapS = THREE.RepeatWrapping; 
        texture.wrapT = THREE.RepeatWrapping;
        texture.generateMipmaps = true;
    });

    const roomGroup = new THREE.Group();
    // Walls
    const leftWall = createConcreteSlab(
        roomProperties.slabThickness,
        roomProperties.height,
        roomProperties.length, 
        textures);
    
    leftWall.receiveShadow = true;
    
    const rightWall = leftWall.clone();
    rightWall.receiveShadow = true;
    
    let pos = new THREE.Vector3(
        roomProperties.width * 0.5 + roomProperties.slabThickness*0.5,
        roomProperties.height * 0.5,
        0);
    rightWall.position.copy(pos);
    pos.x *= -1;
    leftWall.position.copy(pos);
    
    const backWall = createConcreteSlab(
        roomProperties.width,
        roomProperties.height,
        roomProperties.slabThickness,
        textures
    );
    pos.x = 0;
    backWall.receiveShadow = true;
    pos.z = -roomProperties.length * 0.5;
    backWall.position.copy(pos);
    
    // Floor
    const floor = createConcreteSlab(
        roomProperties.width,
        roomProperties.slabThickness,
        roomProperties.length,
        textures);
    floor.receiveShadow = true;
    floor.position.y = -roomProperties.slabThickness * 0.5;

    // Ceiling
    const ceiling = floor.clone();
    floor.receiveShadow = true;
    ceiling.position.y = roomProperties.height + 0.5 * roomProperties.slabThickness;
    
    roomGroup.add(backWall);
    roomGroup.add(leftWall);
    roomGroup.add(rightWall);
    roomGroup.add(floor);
    roomGroup.add(ceiling);
    
    initScene.add(roomGroup);
}

function createConcreteSlab(width, height, depth, textures) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial( {
        map: textures.diffuse,
        normalMap: textures.normal,
        aoMap: textures.arm,
        roughnessMap: textures.arm,
        metalnessMap: textures.arm,
        displacementMap: textures.displace,
        displacementBias: 0.01,
        displacementScale: 0
    });
    
    geometry.attributes.uv2 = geometry.attributes.uv;
    
    return new THREE.Mesh(geometry, material);
}

function setupTypewriter(text, textColor) {
    const fontLoader = new FontLoader();
    fontLoader.load('fonts/Orbitron SemiBold_Regular.json', (font) => {
        Resources.font = font;
        textOptions.font = font; // Assign the loaded font to options

        // 1. Calculate the final width of the full text
        const tempGeometry = new TextGeometry(text, textOptions);
        tempGeometry.computeBoundingBox();
        const fullTextWidth = tempGeometry.boundingBox.max.x - tempGeometry.boundingBox.min.x;
        tempGeometry.dispose(); // Clean up temporary geometry

        // 2. Calculate the starting X position
        // Start X = Desired Center X - (Full Text Width / 2)
        startTextPosition.x = finalTextCenterPoint.x - (fullTextWidth / 2);
        // Set fixed Y and Z positions
        startTextPosition.y = finalTextCenterPoint.y;
        startTextPosition.z = finalTextCenterPoint.z;
        console.log(`Length ${fullTextWidth} . Pos: ${startTextPosition.x}`)

        // Start the typewriter effect
        typeWriterEffect(text, textColor);
    });
}

function typeWriterEffect(fullText, textColor) {
    let currentCharacterIndex = 0;

    function typeNextCharacter() {
        if (currentCharacterIndex <= fullText.length) {
            const displayedText = fullText.substring(0, currentCharacterIndex);

            updateText(displayedText, textColor);

            currentCharacterIndex++;
            setTimeout(typeNextCharacter, typingSpeed);
        }
    }

    typeNextCharacter();
}

function updateText(text, textColor) {
    if (textMesh) {
        initScene.remove(textMesh);
        textMesh.geometry.dispose();
    }

    const textGeometry = new TextGeometry(`${text}`, textOptions);

    textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshStandardMaterial({
            color: palette.lightTeal,
            emissive: textColor,
            emissiveIntensity: 0.2,
            metalness: 0,
            roughness: 1,
        })
    );

    // Position the mesh at the pre-calculated starting point
    textMesh.position.copy(startTextPosition);
    
    textMesh.castShadow = true;
    initScene.add(textMesh);
}

function setupLighting() {
    const lightGroup = new THREE.Group();
    
    const textLightOffset = new THREE.Vector3(2, -0.7, 0);
    setupTextLight(
        lightGroup,
        finalTextCenterPoint.clone().sub(textLightOffset),
        finalTextCenterPoint.clone().add(textLightOffset),
        palette.lightTeal,
        0.2,
        3);
    
    setupTubeLights(
        lightGroup,
        roomProperties.height,
        roomProperties.width - 2 * roomProperties.lightToWallOffset,
        roomProperties.length - 2 * roomProperties.lightToWallOffset,
        lightProperties.tubeRadius,
        lightProperties.tubeColor,
        lightProperties.tubeIntensity);
    
    initScene.add(lightGroup);
}

function setupTextLight(lightGroup, start, end, lightColor, intensity, numLights) {
    
    const length = end.x - start.x;
    const step = length / (numLights - 1);
    
    for (let i = 0; i < numLights; i++) {
        const light = new THREE.PointLight(lightColor, intensity, 15);
        light.position.set(start.x + i * step, start.y, start.z);
        
        lightGroup.add(light);
    }
}
function setupTubeLights(lightGroup, ceilingHeight, roomWidth, roomDepth, tubeRadius, lightColor, intensity) {
    
    const tubeLeft = createTube(
        tubeRadius,
        roomDepth,
        lightColor,
        intensity);
    
    addPointLightsAlongTube(tubeLeft, lightColor, intensity, roomDepth, lightProperties.lightsPerTube);
    tubeLeft.rotation.x = Math.PI / 2;

    const tubeRight = tubeLeft.clone();
    
    let ceilingSideLightPositions = new THREE.Vector3(
        roomWidth * 0.5,
        ceilingHeight - (tubeRadius * 2), 
        0);
    
    tubeRight.position.copy(ceilingSideLightPositions);
    ceilingSideLightPositions.x *= -1;
    tubeLeft.position.copy(ceilingSideLightPositions);
    
    const tubeHorizontal = createTube(
        tubeRadius,
        roomWidth,
        lightColor,
        intensity);
    
    addPointLightsAlongTube(tubeHorizontal, lightColor, intensity, roomWidth, lightProperties.lightsPerTube);
    tubeHorizontal.rotation.x = Math.PI / 2;
    tubeHorizontal.rotation.z = Math.PI / 2;
    
    const horizontalLightPosition = new THREE.Vector3(
        0,
        ceilingHeight - (tubeRadius * 2),
        -roomDepth * 0.5
    );
    
    tubeHorizontal.position.copy(horizontalLightPosition);

    lightGroup.add(tubeLeft);
    lightGroup.add(tubeRight);
    lightGroup.add(tubeHorizontal);
}

function addPointLightsAlongTube(tubeMesh, color, baseIntensity, length, count) {
    const start = -length / 2;
    const end = length / 2;
    const step = length / (count - 1);

    for (let i = 0; i < count; i++) {
        const light = new THREE.PointLight(color, baseIntensity, 50);
        
        light.position.y = start + i * step;
        light.position.z = 0.5;

        tubeMesh.add(light);
    }
}

function createTube(radius, length, color, intensity) {
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16);

    // Material with high emission
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: color,
        emissiveIntensity: intensity,
        metalness: 0,
        roughness: 0
    });

    return new THREE.Mesh(geometry, material);
}
