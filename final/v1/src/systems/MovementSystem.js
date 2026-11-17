import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { Velocity } from "../components/Velocity.js";

export class MovementSystem extends System {
    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, Transform, Velocity);

        for (const entity of entities) {
            const transform = world.getComponent(entity, Transform);
            const velocity = world.getComponent(entity, Velocity);

            transform.x += velocity.x * deltaTime;
            transform.y += velocity.y * deltaTime;
            transform.z += velocity.z * deltaTime;
        }
    }
}