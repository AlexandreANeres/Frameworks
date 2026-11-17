import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { Velocity } from "../components/Velocity.js";
import { Grounded } from "../components/Grounded.js";

export class GroundSystem extends System {
    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, Transform, Velocity, Grounded);

        for (const entity of entities) {
            const transform = world.getComponent(entity, Transform);
            const velocity = world.getComponent(entity, Velocity);
            const grounded = world.getComponent(entity, Grounded);

            // Fake floor at y = 0;
            if (transform.y <= 0 && velocity.y <= 0) {
                transform.y = 0;
                
                if (velocity.y < 0) velocity.y = 0;
                grounded.isGrounded = true;
            }

            // Simple gravity when airborne
            if (!grounded.isGrounded) {
                velocity.y += -9.8 * deltaTime;
            }
        }
    }
}