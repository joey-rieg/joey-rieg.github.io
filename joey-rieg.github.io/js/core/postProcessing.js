import * as THREE from "three";
import {isWebGpuAvailable} from '../utils/webGpuCheck';

export async function initPostProcessing(renderer, scene, camera) {
    const isAvailable = await isWebGpuAvailable();
    if (isAvailable) {
        const THREE_WEBGPU = await import('three/webgpu');
        const THREE_TSL = await import('three/src/Three.TSL');
        const THREE_WEBGPU_BLOOM = await import('three/addons/tsl/display/BloomNode');
        
        return new WebGPUPostProcessor(
            renderer,
            camera,
            scene,
            THREE_WEBGPU,
            THREE_TSL,
            THREE_WEBGPU_BLOOM,
        );
    } else {
        const THREE_COMPOSER = await import('three/addons/postprocessing/EffectComposer');
        const THREE_RENDER_PASS = await import('three/addons/postprocessing/RenderPass');
        const THREE_BLOOM_PASS = await import('three/addons/postprocessing/UnrealBloomPass');
        const THREE_OUTPUT = await import('three/addons/postprocessing/OutputPass');
        
        return new WebGLPostProcessor(
            renderer,
            camera,
            scene,
            THREE_COMPOSER,
            THREE_RENDER_PASS,
            THREE_BLOOM_PASS,
            THREE_OUTPUT,);
    }
}

class PostProcessor {
    constructor(renderer, camera, scene) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
    }

    addBloom() { throw new Error('Subclass must implement this method'); }
    render() { throw new Error('Subclass must implement this method'); }
}

class WebGPUPostProcessor extends PostProcessor {
    constructor(renderer, camera, scene, THREE_WEBGPU, THREE_TSL, THREE_WEBGPU_BLOOM) {
        super(renderer, camera, scene); // Call base constructor with correct order

        this.THREE_WEBGPU = THREE_WEBGPU;
        this.THREE_TSL = THREE_TSL;
        this.THREE_WEBGPU_BLOOM = THREE_WEBGPU_BLOOM;

        this.postProcessor = new this.THREE_WEBGPU.PostProcessing(renderer);
    }

    addBloom() {
        const scenePass = this.THREE_TSL.pass(this.scene, this.camera);
        const scenePassColor = scenePass.getTextureNode('output');

        const bloomPass = this.THREE_WEBGPU_BLOOM.bloom(scenePassColor);
        this.postProcessor.outputNode = scenePassColor.add(bloomPass);
    }

    render() {
        this.postProcessor.render();
    }
}

export class WebGLPostProcessor extends PostProcessor {
    constructor(renderer, camera, scene, THREE_COMPOSER, THREE_RENDER_PASS, THREE_BLOOM_PASS, THREE_OUTPUT_PASS) {
        super(renderer, camera, scene);
        this.THREE_COMPOSER = THREE_COMPOSER;
        this.THREE_RENDER_PASS = THREE_RENDER_PASS;
        this.THREE_BLOOM_PASS = THREE_BLOOM_PASS;
        this.THREE_OUTPUT_PASS = THREE_OUTPUT_PASS
        
        this.postProcessor = new THREE_COMPOSER.EffectComposer(renderer);
        const renderPass = new THREE_RENDER_PASS.RenderPass(this.scene, this.camera);
        this.postProcessor.addPass(renderPass);
    }

    addBloom() {
        this.renderer.toneMapping = THREE.LinearToneMapping;
        const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
        const bloomPass = new this.THREE_BLOOM_PASS.UnrealBloomPass( resolution, 0.6, 0.2, 0 );
        this.postProcessor.addPass(bloomPass);
        const outputPass = new this.THREE_OUTPUT_PASS.OutputPass();
        this.postProcessor.addPass(outputPass);
    }

    render() {
        this.postProcessor.render();
    }
}
