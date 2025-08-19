import * as THREE from 'three';
import {time} from "three/src/Three.TSL";

window.initShaderGradient = () => {
    const container = document.getElementById('three-container');

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(- 1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    let mouse = { x: 0.5, y: 0.5 }; // normalized coordinates (0–1)
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX / window.innerWidth;
        mouse.y = 1 - e.clientY / window.innerHeight; // flip y for shader
    });
    
    const material = new THREE.ShaderMaterial({
       uniforms: {
           u_time: { value: 0.0 },
           u_mouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
           u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
           u_aspect: { value: window.innerWidth / window.innerHeight }
       },
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform float u_aspect;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                
                vec2 diff = uv - u_mouse;
                diff.x *= u_aspect;  // aspect correction
            
                float dist = length(diff);
                float blob = smoothstep(0.2, 0.0, dist);
            
                vec3 color = mix(vec3(0.0, 0.0, 0.1), vec3(0.2, 0.6, 1.0), blob);
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () =>
    {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        material.uniforms.u_aspect.value = (window.innerWidth / window.innerHeight);
    }

    window.addEventListener('resize', resize);
    resize(); // Initial resize
    
    function animate() {
        requestAnimationFrame(animate);

        material.uniforms.u_time.value = clock.getElapsedTime();
        material.uniforms.u_mouse.value.set(mouse.x, mouse.y);

        renderer.render(scene, camera);
    }
    
    animate(time);
};
