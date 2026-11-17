import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Input } from "../components/Input.js";
import { ControlMode, CONTROL_MODE } from "../components/ControlMode.js";
import { PlayerControlled } from "../components/PlayerControlled.js";
import { Transform } from "../components/Transform.js";

export class ModeSwitchSystem extends System {
    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, PlayerControlled, Input, ControlMode);

        for (const e of entities) {
            const input = world.getComponent(e, Input);
            const mode = world.getComponent(e, ControlMode);

            if (input.toggleModePressed) {
                mode.mode = (mode.mode === CONTROL_MODE.FACE_MOVE)
                ? CONTROL_MODE.STRAFE
                : CONTROL_MODE.FACE_MOVE;

                // If rotY ever got corrupted, reset it
                const t = world.getComponent(e, Transform);
                if (t && !Number.isFinite(t.rotY)) t.rotY = 0;
            }
        }
    }
}