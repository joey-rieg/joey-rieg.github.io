import * as THREE from 'three';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Flicker} from "../utils/flicker";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js";
import {palette} from "../utils/colorPalette";


const Resources = {font: undefined};
const textGlowColor = palette.lightTeal;
const targetText = "> This website is under construction ...";
const typingSpeed = 75; // milliseconds per character
const additionalTextShift = 8;

let textMesh;
let initScene;
let transformControls;
let startTextPosition = new THREE.Vector3(); // Will be calculated dynamically
let flicker = new Flicker();

// Define the desired final center point in the scene
const finalTextCenterPoint = new THREE.Vector3(0, 1.5, -4);
// Define the text options we will use for the geometry
const textOptions = {
    size: 0.2,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 1,
};
export function initComingSoonScene(scene, camera, domElement, world) {
    initScene = scene;
    setupRoom();
    setupLighting();
    setupGUI();

    //flicker.startFlicker();
    setupTypewriter(targetText, textGlowColor);
}

function setupGUI() {
    const gui = new GUI();
    }

function setupRoom() {
    const height = 5;
    const thickness = 1;
    const length = 10;
    
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
    const leftWall = createConcreteSlab(thickness, height, length, textures);
    leftWall.receiveShadow = true;
    
    const rightWall = leftWall.clone();
    rightWall.receiveShadow = true;
    
    let pos = new THREE.Vector3(
        length * 0.5 + thickness*0.5,
        height * 0.5,
        0);
    rightWall.position.copy(pos);
    pos.x *= -1;
    leftWall.position.copy(pos);
    
    const backWall = leftWall.clone();
    backWall.receiveShadow = true;
    pos.x = 0;
    pos.z = -length * 0.5;
    backWall.position.copy(pos);
    backWall.rotation.y = -Math.PI/2;
    
    // floor
    const floor = createConcreteSlab(length, thickness, length, textures);
    floor.receiveShadow = true;
    floor.position.y = -thickness * 0.5;

    // ceiling
    const ceiling = floor.clone();
    floor.receiveShadow = true;
    ceiling.position.y = height + 0.5 * thickness;
    
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
            emissiveIntensity: 0.3,
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
    const lightColor = new THREE.Color(palette.lightOrange);
    const height = 2;
    const tubeRadius = 0.01;
    const intensity = 0.3;
    const tubePosition = new THREE.Vector3(3,height * 0.5, -3);
    
    const ceilingWidth = 10;
    const ceilingHeight = 5;
    const ceilingDepth = 10;
    
    const lightGroup = new THREE.Group();
    
    setupTubeLights(lightGroup, ceilingHeight, ceilingWidth, ceilingDepth, tubeRadius, lightColor, intensity);
    
    initScene.add(lightGroup);
}

function setupTubeLights(lightGroup, ceilingHeight, roomWidth, roomDepth, tubeRadius, lightColor, intensity) {
    
    const tubeLeft = createTube(
        tubeRadius,
        roomDepth,
        lightColor,
        intensity);
    
    tubeLeft.rotation.x = Math.PI / 2;
    addPointLightsAlongTube(tubeLeft, lightColor, intensity, roomDepth, 4);

    const tubeRight = tubeLeft.clone();
    
    let ceilingSideLightPositions = new THREE.Vector3(
        roomWidth*0.5 - 1,
        ceilingHeight - (tubeRadius * 2), 
        0);
    
    tubeRight.position.copy(ceilingSideLightPositions);
    ceilingSideLightPositions.x *= -1;
    tubeLeft.position.copy(ceilingSideLightPositions);
    
    const tubeHorizontal = createTube(
        tubeRadius,
        roomWidth - 2,
        lightColor,
        intensity);
    
    addPointLightsAlongTube(tubeHorizontal, lightColor, intensity, roomWidth - 2, 4);
    tubeHorizontal.rotation.z = Math.PI / 2;
    
    const horizontalLightPosition = new THREE.Vector3(
        0,
        ceilingHeight - (tubeRadius * 2),
        -roomDepth * 0.5 + 1
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
        const light = new THREE.PointLight(color, baseIntensity, 15);
        // Position lights along the Z axis of the TUBE's local coordinate system
        light.position.y = start + i * step;

        // Add the light to the tube mesh so it moves with it
        tubeMesh.add(light);
    }
}

function createTube(radius, length, color, intensity) {
    // Geometry for a cylinder (the "tube" shape)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16);

    // Material with high emission
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,          // Base color (can be black)
        emissive: color,          // The glowing color
        emissiveIntensity: intensity, // Visually bright emission
        metalness: 0,
        roughness: 0
    });

    return new THREE.Mesh(geometry, material);
}
