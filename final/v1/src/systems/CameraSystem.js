import * as THREE from "three";
import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { PlayerControlled } from "../components/PlayerControlled.js";
import { CameraFollow } from "../components/CameraFollow.js";

function damp(current, target, smoothing, deltaTime) {
    // Exponential smoothing. Higher smoothing = faster catch-up.
    const t = 1 - Math.exp(-smoothing * deltaTime); // suavização exponencial
    return current + (target - current) * t;
}

export class CameraSystem extends System {
    constructor(camera) {
        super();
        this.camera = camera;
        
        // We'll keep a smoothed position so the camera doesn't snap.
        this.smoothedPosition = new THREE.Vector3();
        this.initialized = false;
    }

    update(world, deltaTime) {
        const players = Query.entitiesWith(world, PlayerControlled, Transform); // separamos o player
        const cameras = Query.entitiesWith(world, CameraFollow); // separamos a camera

        if (players.length === 0 || cameras.length === 0) return;

        const playerEntity = players[0];
        const cameraEntity = cameras[0];

        const playerTransform = world.getComponent(playerEntity, Transform);
        const follow = world.getComponent(cameraEntity, CameraFollow);

        // Computamos aonde a camera deve estar usando offsets
        const targetCamX = playerTransform.x + follow.offsetX;
        const targetCamY = playerTransform.y + follow.offsetY;
        const targetCamZ = playerTransform.z + follow.offsetZ;

        if (!this.initialized) {
            this.smoothedPosition.set(targetCamX, targetCamY, targetCamZ);
            this.initialized = true;
        }

        // Suavizamos o movimento da câmera com a função damp, por ser função exponencial, imagina uma função quadrática no plano cartesiano, ela é curva e suave.
        this.smoothedPosition.x = damp(this.smoothedPosition.x, targetCamX, follow.smoothness, deltaTime);
        this.smoothedPosition.y = damp(this.smoothedPosition.y, targetCamY, follow.smoothness, deltaTime);
        this.smoothedPosition.z = damp(this.smoothedPosition.z, targetCamZ, follow.smoothness, deltaTime);

        this.camera.position.copy(this.smoothedPosition);

        // Computamos para a câmera olhar para o player
        this.camera.lookAt(
            playerTransform.x,
            playerTransform.y + follow.lookAtHeight,
            playerTransform.z
        );
    }
}