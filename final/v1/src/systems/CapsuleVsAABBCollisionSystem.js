import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { Velocity } from "../components/Velocity.js";
import { ColliderAABB } from "../components/ColliderAABB.js";
import { StaticBody } from "../components/StaticBody.js";
import { DynamicBody } from "../components/DynamicBody.js";
import { Grounded } from "../components/Grounded.js";
import { CapsuleCollider } from "../components/CapsuleCollider.js";

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function closestPointOnAABB (px, py, pz, boxCenter, boxHalf) {
    return {
        x: clamp(px, boxCenter.x - boxHalf.halfX, boxCenter.x + boxHalf.halfX),
        y: clamp(py, boxCenter.y - boxHalf.halfY, boxCenter.y + boxHalf.halfY),
        z: clamp(pz, boxCenter.z - boxHalf.halfZ, boxCenter.z + boxHalf.halfZ)
    };
}

function capsuleSegment(transform, capsule) {
    // Capsule is upright: a segment plus radius.
    // We'll treat transform as the capsule BASE (feet) position.

    const bottomY = transform.y - capsule.halfHeight;
    const topY = transform.y + capsule.halfHeight;
    return { bottomY, topY };
}

function elevarAoQuadrado(number) {
    return number * number;
}

export class CapsuleVsAABBCollisionSystem extends System {
    update(world, deltaTime) {
        // Dynamics: our capsule character
        const dynamics = Query.entitiesWith(world, DynamicBody, Transform, Velocity, CapsuleCollider);

        //Statics: world boxes (ground + walls)
        const statics = Query.entitiesWith(world, StaticBody, Transform, ColliderAABB);

        for (const d of dynamics) {
            const dt = world.getComponent(d, Transform);
            const dv = world.getComponent(d, Velocity);
            const capsule = world.getComponent(d, CapsuleCollider);
            const grounded = world.getComponent(d, Grounded);

            if (grounded) grounded.isGrounded = false;

            const { bottomY, topY } = capsuleSegment(dt, capsule);

            for (const s of statics) {
                const st = world.getComponent(s, Transform);
                const box = world.getComponent(s, ColliderAABB);

                // Choose a point along the capsule segment taht is closest in Y to the box center
                const closestYOnCapsule = clamp(st.y, bottomY, topY);

                // Closest point on the AABB to that capsule point
                const closest = closestPointOnAABB(dt.x, closestYOnCapsule, dt.z, st, box);

                // Vector from closest point on box to capsule center-line point
                const dx = dt.x - closest.x;
                const dy = closestYOnCapsule - closest.y;
                const dz = dt.z - closest.z;

                const distSq = elevarAoQuadrado(dx) + elevarAoQuadrado(dy) + elevarAoQuadrado(dz);
                const r = capsule.radius;

                if (distSq >= elevarAoQuadrado(r)) continue;

                const dist = Math.sqrt(distSq) || 0.000001;
                const penetration = r - dist;

                // Normal from box to capsule
                const nx = dx / dist;
                const ny = dy / dist;
                const nz = dz / dist;

                // Push capsule out
                dt.x += nx * penetration;
                dt.y += ny * penetration;
                dt.z += nz * penetration;

                // Remove velocity into the surface (simple slide)
                const vn = dv.x * nx + dv.y * ny + dv.z * nz;
                if (vn < 0) {
                    dv.x -= vn * nx;
                    dv.y -= vn * ny;
                    dv.z -= vn * nz;
                }

                // Grounding: if we were pushed uward, we are standing on something
                if (grounded && ny > 0.5) {
                    grounded.isGrounded = true;
                }
            }
        }
    }
}