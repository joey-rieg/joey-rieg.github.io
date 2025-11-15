import * as THREE from "three";
import {PointerLockControls} from "three/addons/controls/PointerLockControls";

export class Controls {
    #controls;
    constructor(camera, domElement) {
        
        this.velocity = new THREE.Vector3();
        this.speed = 10;
        this.move = { forward: false, backward: false, left: false, right: false, up: false, down: false };
        this.camera = camera;
        this.domElement = domElement;
        this.isEnabled = false;
        this.isLocked = false;
        this.#controls = new PointerLockControls(camera, domElement);
    }
    
    enable() {
        this.isEnabled = true;
        this.#controls.isLocked = true;

        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyP') {
                this.#controls.lock();
            }
        });
        
        // Key events
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.move.forward = true; break;
                case 'KeyS': this.move.backward = true; break;
                case 'KeyA': this.move.left = true; break;
                case 'KeyD': this.move.right = true; break;
                case 'KeyQ': this.move.down = true; break;
                case 'KeyE': this.move.up = true; break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.move.forward = false; break;
                case 'KeyS': this.move.backward = false; break;
                case 'KeyA': this.move.left = false; break;
                case 'KeyD': this.move.right = false; break;
                case 'KeyQ': this.move.down = false; break;
                case 'KeyE': this.move.up = false; break;
            }
        });
    }
    
    update(delta, scene) {
        if (this.#controls.isLocked) { // Move only when the pointer is locked
            this.velocity.set(0, 0, 0);

            if (this.move.forward) this.velocity.z += this.speed * delta;
            if (this.move.backward) this.velocity.z -= this.speed * delta;
            if (this.move.left) this.velocity.x -= this.speed * delta;
            if (this.move.right) this.velocity.x += this.speed * delta;
            if (this.move.up) this.camera.position.y += this.speed * delta;
            if (this.move.down) this.camera.position.y -= this.speed * delta;

            // Apply movement relative to camera orientation
            this.#controls.moveRight(this.velocity.x);
            this.#controls.moveForward(this.velocity.z);
        }
    }
}
