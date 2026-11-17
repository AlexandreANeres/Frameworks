import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { CameraRig } from "../components/CameraRig.js";
import { Aim } from "../components/Aim.js";
import { PlayerControlled } from "../components/PlayerControlled.js";
import { ControlMode, CONTROL_MODE } from "../components/ControlMode.js";

export class CameraAimSystem extends System {
    update(world, dt) {
        const cams = Query.entitiesWith(world, CameraRig);
        if (cams.length === 0) return;

        const rig = world.getComponent(cams[0], CameraRig);
        if (!rig || !Number.isFinite(rig.yaw)) return;

        const players = Query.entitiesWith(world, PlayerControlled, Aim, ControlMode);

        for (const p of players) {
            const mode = world.getComponent(p, ControlMode);
            if (mode.mode !== CONTROL_MODE.STRAFE) continue;

            const aim = world.getComponent(p, Aim);
            aim.yaw = rig.yaw;
        }
    }
}