import { CameraFollow } from "../components/CameraFollow.js";
import { CameraRig } from "../components/CameraRig.js";

export function createFollowCamera(world, targetEntity) {
    const cameraEntity = world.createEntity();

    world.addComponent(cameraEntity, new CameraRig());

    world.addComponent(cameraEntity, new CameraFollow({
        offsetY: 3,
        offsetZ: 6,
        smoothness: 8,
        lookAtHeight: 1
    }));

    // Store the target on the rig
    const rig = world.getComponent(cameraEntity, CameraRig);
    rig.target = targetEntity;

    return cameraEntity;
}