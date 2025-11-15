import * as THREE from "three";
export class InteractionManager {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.interactiveObjects = [];
        this.hoveredObject = null;
        
        window.addEventListener('mousemove', this.#onPointerMove.bind(this), false);
        window.addEventListener('click', this.#onClick.bind(this), false);
    }

    update() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

        // No objects hovered
        if (intersects.length <= 0)
        {
            if (this.hoveredObject && this.hoveredObject.userData && this.hoveredObject.userData.onHoverOut) {
                this.hoveredObject.userData.onHoverOut();
            }

            this.hoveredObject = null;
            return;
        }
        
        // Hovering the same object
        const firstObject = intersects[0].object;
        if (firstObject === this.hoveredObject) return;
    
        // Handle old potentially hovered object
        if (this.hoveredObject && this.hoveredObject.userData && this.hoveredObject.userData.onHoverOut) {
            this.hoveredObject.userData.onHoverOut();
        }

        // Handle newly hovered object
        this.hoveredObject = firstObject;
        if (this.hoveredObject.userData && this.hoveredObject.userData.onHoverIn) {
            this.hoveredObject.userData.onHoverIn();
        }
    }
    
    registerSceneObjects(scene) {
        this.clearAllObjects();
        scene.traverse(object => {
            this.register(object);
        });
    }

    register(object) {
        this.interactiveObjects.push(object);
    }

    deregister(object)
    {
        const idx = this.interactiveObjects.indexOf(object);
        if (idx < 0) return;

        this.interactiveObjects.splice(idx, 1);
        if (this.hoveredObject === object)
        {
            // TODO: check if calling hoverOut is needed
            this.hoveredObject = null;
        }
    }

    clearAllObjects()
    {
        // TODO: check if calling hoverOut is needed
        this.hoveredObject = null;
        this.interactiveObjects = [];
    }
    
    #onPointerMove(event) {
        this.pointer.x =  (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    #onClick(event)
    {
        if (!this.hoveredObject) return;
        
        if (this.hoveredObject.userData && this.hoveredObject.userData.onClick) {
            this.hoveredObject.userData.onClick();
        }
    }
}