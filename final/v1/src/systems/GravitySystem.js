import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Velocity } from "../components/Velocity.js";
import { Grounded } from "../components/Grounded.js";

export class GravitySystem extends System {
    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, Velocity, Grounded);

        for (const e of entities) {
            const v = world.getComponent(e, Velocity);
            const g = world.getComponent(e, Grounded);

            if (!g.isGrounded) {
                v.y += -9.8 * deltaTime;
            }
        }

    }
}