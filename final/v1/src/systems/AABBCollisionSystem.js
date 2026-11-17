import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { Velocity } from "../components/Velocity.js";
import { ColliderAABB } from "../components/ColliderAABB.js";
import { StaticBody } from "../components/StaticBody.js";
import { DynamicBody } from "../components/DynamicBody.js";
import { Grounded } from "../components/Grounded.js";

function overlapOnAxis(aPos, aHalf, bPos, bHalf) {
    const dist = aPos - bPos;
    const overlap = (aHalf + bHalf) - Math.abs(dist); //Math.abs == return ABSOLUTE value of a NUMBER
    return { dist, overlap };
}

export class AABBCollisionSystem extends System {
    update(world, deltaTime) {
        const dynamics = Query.entitiesWith(world, DynamicBody, Transform, Velocity, ColliderAABB);
        const statics = Query.entitiesWith(world, StaticBody, Transform, ColliderAABB);

        for (const d of dynamics) {
            const dt = world.getComponent(d, Transform);
            const dv = world.getComponent(d, Velocity);
            const dc = world.getComponent(d, ColliderAABB);
            const grounded = world.getComponent(d, Grounded);

            if (grounded) grounded.isGrounded = false;

            for (const s of statics) {
                const st = world.getComponent(s, Transform);
                const sc = world.getComponent(s, ColliderAABB);

                const ox = overlapOnAxis(dt.x, dc.halfX, st.x, sc.halfX);
                const oy = overlapOnAxis(dt.y, dc.halfY, st.y, sc.halfY);
                const oz = overlapOnAxis(dt.z, dc.halfZ, st.z, sc.halfZ);

                const isOverlapping = ox.overlap > 0 && oy.overlap > 0 && oz.overlap > 0;
                if (!isOverlapping) continue;

                // Push out along the smallest overlap axis
                if (ox.overlap <= oy.overlap && ox.overlap <= oz.overlap) {
                    const push = Math.sign(ox.dist) * ox.overlap;
                    dt.x += push;
                    dv.x = 0;
                } else if (oy.overlap <= ox.overlap && oy.overlap <= oz.overlap) {
                    const push = Math.sign(oy.dist) * oy.overlap;
                    dt.y += push;
                    if (dv.y < 0) dv.y = 0;

                    // If we pushed upward, we landed
                    if (push > 0 && grounded) grounded.isGrounded = true;
                } else {
                    const push = Math.sign(oz.dist) * oz.overlap;
                    dt.z += push;
                    dv.z = 0;
                }
            }
        }
    }
}