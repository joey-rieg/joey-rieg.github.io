import * as THREE from 'three/webgpu';

function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    camera.position.set( -1.5, 1, 5);
    
    return camera;
}

async function createRenderer(containerId) {
    const container = document.querySelector(`.${containerId}`);
    const renderer = new THREE.WebGPURenderer({ antialias: true});
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Wait for WebGPU backend to initialize
    await renderer.init();

    // Attach dom element
    container.appendChild(renderer.domElement);
    
    return renderer;
}

function createObjects(scene)
{
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    
    const planeGeometry = new THREE.PlaneGeometry(20, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    planeMaterial.dithering = true;
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);
    
    return { cube, plane };
}

function createLights(scene)
{
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( -5, 5, -1);
    spotLight.intensity = 10;
    spotLight.penumbra = 1;
    spotLight.distance = 0;
    spotLight.angle = Math.PI / 6;
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.003;
    scene.add(spotLight);
    
    return { spotLight };
}

function animate(renderer, camera, scene, objects) {
    renderer.setAnimationLoop(() => {
        objects.cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    });
}

function setupResize(renderer, camera) {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

window.initThree = async function(canvasId) {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = await createRenderer(canvasId);
    const objects = createObjects(scene);
    const lights = createLights(scene);
    animate(renderer, camera, scene, objects);
    
    setupResize(renderer, camera);
}
