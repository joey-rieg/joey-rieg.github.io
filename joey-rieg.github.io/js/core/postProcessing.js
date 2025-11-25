// import {isWebGpuAvailable} from '../utils/webGpuCheck';
//
// export async function initPostProcessing(renderer, scene, camera) {
//     const isAvailable = await isWebGpuAvailable();
//     if (isAvailable) {
//         const THREE_WEBGPU = await import('three/webgpu');
//         const THREE_TSL = await import('three/src/Three.TSL');
//         const THREE_WEBGPU_BLOOM = await import('three/addons/tsl/display/BloomNode');
//
//         return new WebGPUPostProcessor(
//             renderer,
//             camera,
//             scene,
//             THREE_WEBGPU,
//             THREE_TSL,
//             THREE_WEBGPU_BLOOM,
//         );
//     } else return new WebGLPostProcessor(renderer, scene, camera);
// }
//
// class PostProcessor {
//     constructor(renderer, camera, scene) {
//         this.renderer = renderer;
//         this.camera = camera;
//         this.scene = scene;
//     }
//
//     addBloom() { throw new Error('Subclass must implement this method'); }
//     render() { throw new Error('Subclass must implement this method'); }
// }
//
// class WebGPUPostProcessor extends PostProcessor {
//     constructor(renderer, camera, scene, THREE_WEBGPU, THREE_TSL, THREE_WEBGPU_BLOOM) {
//         super(renderer, camera, scene);
//        
//         this.THREE_WEBGPU = THREE_WEBGPU;
//         this.THREE_TSL = THREE_TSL;
//         this.THREE_WEBGPU_BLOOM = THREE_WEBGPU_BLOOM;
//        
//         this.postProcessor = new this.THREE_WEBGPU.PostProcessing(renderer);
//     }
//    
//     addBloom() {
//         const scenePass = this.THREE_TSL.pass(this.scene, this.camera);
//         const scenePassColor = scenePass.getTextureNode('output');
//        
//         const bloomPass = this.THREE_WEBGPU_BLOOM.bloom(scenePassColor);
//         this.postProcessor.outputNode = scenePassColor.add(bloomPass);
//     }
//    
//     render() {
//         this.postProcessor.render();
//     }
// }
//
// export class WebGLPostProcessor extends PostProcessor {
//     constructor(renderer, camera, scene) {
//         super(renderer, camera, scene);
//     }
//    
//     addBloom()
//     {
//         console.log("Adding Bloom");
//     }
//    
//     render() {
//         this.renderer.render(this.camera, this.scene);
//     }
// }

// YourModuleName.js

import {isWebGpuAvailable} from '../utils/webGpuCheck';

// Factory function remains unchanged (arguments are correctly ordered here)
export async function initPostProcessing(renderer, scene, camera) {
    const isAvailable = await isWebGpuAvailable();
    if (isAvailable) {
        const THREE_WEBGPU = await import('three/webgpu');
        const THREE_TSL = await import('three/src/Three.TSL');
        const THREE_WEBGPU_BLOOM = await import('three/addons/tsl/display/BloomNode');

        // Pass arguments to the constructor (which we fix below)
        return new WebGPUPostProcessor(
            renderer,
            camera, // Note: Order here must match constructor order
            scene,  // Note: Order here must match constructor order
            THREE_WEBGPU,
            THREE_TSL,
            THREE_WEBGPU_BLOOM,
        );
    } else {
        return new WebGLPostProcessor(renderer, camera, scene);
    }
}

class PostProcessor {
    // Base expects (renderer, camera, scene)
    constructor(renderer, camera, scene) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
    }

    addBloom() { throw new Error('Subclass must implement this method'); }
    render() { throw new Error('Subclass must implement this method'); }
}

class WebGPUPostProcessor extends PostProcessor {
    // FIX 1: Ensure arguments match the base class expected order: (renderer, camera, scene)
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
        // WebGPU PostProcessing.render() does not require arguments
        this.postProcessor.render();
    }
}

export class WebGLPostProcessor extends PostProcessor {
    // Constructor matches base class order: (renderer, camera, scene)
    constructor(renderer, camera, scene) {
        super(renderer, camera, scene);
        // Note: You would initialize the EffectComposer here for WebGL
        console.warn("WebGL Post Processing initialized but AddBloom not fully implemented.");
    }

    addBloom() {
        console.log("Adding Bloom (WebGL placeholder)");
    }

    render() {
        // FIX 2: WebGLRenderer.render() needs scene and camera arguments
        this.renderer.render(this.scene, this.camera);
    }
}
