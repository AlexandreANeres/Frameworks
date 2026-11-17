import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { CameraRig } from "../components/CameraRig.js";
import { CameraFollow } from "../components/CameraFollow.js";
import { Transform } from "../components/Transform.js";

export class OrbitCameraSystem extends System {
    constructor(threeCamera) {
        super();
        this.camera = threeCamera;
    }

    update(world, dt) {
        const cams = Query.entitiesWith(world, CameraRig, CameraFollow);

        for (const e of cams) {
            const rig = world.getComponent(e, CameraRig);
            const follow = world.getComponent(e, CameraFollow);

            const targetTransform = world.getComponent(rig.target, Transform);
            if(!targetTransform) continue;

            const targetX = targetTransform.x;
            const targetY = targetTransform.y + follow.lookAtHeight;
            const targetZ = targetTransform.z;

            const cosPitch = Math.cos(rig.pitch);
            const sinPitch = Math.sin(rig.pitch);
            const cosYaw = Math.cos(rig.yaw);
            const sinYaw = Math.sin(rig.yaw);

            const distance = rig.distance;

            const desiredX = targetX + sinYaw * cosPitch * distance;
            const desiredY = targetY + sinPitch * distance * follow.offsetY;
            const desiredZ = targetZ + cosYaw * cosPitch * distance;

            // Smooth follow
            const lerp = 1 - Math.exp(-follow.smoothness * dt);

            this.camera.position.x += (desiredX - this.camera.position.x) * lerp;
            this.camera.position.y += (desiredY - this.camera.position.y) * lerp;
            this.camera.position.z += (desiredZ - this.camera.position.z) * lerp;

            this.camera.lookAt(targetX, targetY, targetZ);
        }
    }
}