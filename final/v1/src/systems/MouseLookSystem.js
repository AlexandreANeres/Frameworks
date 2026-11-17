import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { CameraRig } from "../components/CameraRig.js";

export class MouseLookSystem extends System {
    constructor(domElement) {
        super();
        this.domElement = domElement;
        this.dx = 0;
        this.dy = 0;
        this.wheel = 0;

        this.isRotating = false;

        // Prevent right-click menu
        domElement.addEventListener("contextmenu", (e) => e.preventDefault());

        // RMB down = start rotating
        domElement.addEventListener("mousedown", (e) => {
            if (e.button === 2) {
                // Right mouse button
                this.isRotating = true;
                domElement.requestPointerLock();
            }
        });

        // Release right mouse button to stop rotating
        window.addEventListener("mouseup", (e) => {
            if (e.button === 2) {
                this.isRotating = false;
                if (document.pointerLockElement === domElement) {
                    document.exitPointerLock();
                }
            }
        })

        // Mouse move
        domElement.addEventListener("mousemove", e => {
            if (document.pointerLockElement === domElement) {
                this.dx += e.movementX;
                this.dy += e.movementY;
            }
        })

        // Zoom
        domElement.addEventListener("wheel", e => {
            e.preventDefault(); // Stop the page from scrolling
            this.wheel += e.deltaY * 0.01;
        },
        { passive: false} // allows preventDefault
);
    }

    update(world, dt) {
        const cameras = Query.entitiesWith(world, CameraRig);

        for (const e of cameras) {
            const rig = world.getComponent(e, CameraRig);

            rig.yaw -= this.dx *  0.002;
            rig.pitch -= this.dy * 0.002;

            if (this.wheel) {
                rig.distance += this.wheel;
                rig.distance = Math.max(rig.minDistance, Math.min(rig.maxDistance, rig.distance));
            }
        }
        
        this.dx = 0;
        this.dy = 0;
        this.wheel = 0;
    }
}