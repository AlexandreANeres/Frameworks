import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { CameraRig } from "../components/CameraRig.js";
import { CameraBasis } from "../components/CameraBasis.js";
import { PlayerControlled } from "../components/PlayerControlled.js";

export class CameraBasisSystem extends System {
    update(world, dt) {
        const cams = Query.entitiesWith(world, CameraRig);
        if (cams.length === 0) return;

        const rig = world.getComponent(cams[0], CameraRig);
        if (!rig || !Number.isFinite(rig.yaw)) return;

        const players = Query.entitiesWith(world, PlayerControlled, CameraBasis);

        for (const p of players) {
            const basis = world.getComponent(p, CameraBasis);
            basis.yaw = rig.yaw;
        }
    }
}