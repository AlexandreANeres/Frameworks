import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Input } from "../components/Input.js";
import { PlayerControlled } from "../components/PlayerControlled.js";
import { ControllerSettings } from "../components/ControllerSetting.js";
import { Velocity } from "../components/Velocity.js";
import { Grounded } from "../components/Grounded.js";
import { Transform } from "../components/Transform.js";
import { ControlMode, CONTROL_MODE } from "../components/ControlMode.js";
import { CameraRig } from "../components/CameraRig.js";
import { Aim } from "../components/Aim.js";
import { CameraBasis } from "../components/CameraBasis.js";

function moveTowards(current, target, maxDelta) {
    if (Math.abs(target - current) <= maxDelta) return target;
    return current + Math.sign(target - current) * maxDelta;
}

function wrapAngleRad(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
}

function dampAngle(current, target, smoothing, deltaTime) {
    if (!Number.isFinite(current)) current = 0;
    if (!Number.isFinite(target)) return current;

    let delta = wrapAngleRad(target - current);
    const t = 1 - Math.exp(-smoothing * deltaTime);
    return wrapAngleRad(current + delta * t);
}

export class PlayerControllerSystem extends System {
    update(world, deltaTime) {
        const entities = Query.entitiesWith(
            world,
            PlayerControlled,
            Input,
            ControllerSettings,
            Velocity,
            Grounded,
            Transform,
            ControlMode,
            Aim,
            CameraBasis
        );

        for (const entity of entities) {
            const input = world.getComponent(entity, Input);
            const setting = world.getComponent(entity, ControllerSettings);
            const velocity = world.getComponent(entity, Velocity);
            const grounded = world.getComponent(entity, Grounded);
            const transform = world.getComponent(entity, Transform);
            const mode = world.getComponent(entity, ControlMode);

            //Choose speed
            const speed = input.runHeld ? setting.runSpeed : setting.walkSpeed; // Se a entidade está correndo, ele captura a velocidade de corrida, senão, ele captura a velocidade padrão do andar

            // Read & normalize input axes
            const rawX = Number.isFinite(input.moveX) ? input.moveX : 0;
            const rawZ = Number.isFinite(input.moveZ) ? input.moveZ : 0;

            const len = Math.hypot(rawX, rawZ);
            const mx = len > 1 ? rawX / len : rawX;
            const mz = len > 1 ? rawZ / len : rawZ;

            // Camera-relative movement
            const basis = world.getComponent(entity, CameraBasis);
            const yaw = basis && Number.isFinite(basis.yaw) ? basis.yaw : 0;

            const sin = Math.sin(yaw);
            const cos = Math.cos(yaw);

            // Camera-forward (on XZ) and camera-right vectors
            const forwardX = sin;
            const forwardZ = cos;
            const rightX = cos;
            const rightZ = -sin;

            // Convert local input into world-space direction
            const worldX = rightX * mx + forwardX * mz;
            const worldZ = rightZ * mx + forwardZ * mz;

            const targetVX = worldX * speed;
            const targetVZ = worldZ * speed;

            // Smooth acelleration
            const maxDelta = setting.acceleration * deltaTime;
            velocity.x = moveTowards(velocity.x, targetVX, maxDelta);
            velocity.z = moveTowards(velocity.z, targetVZ, maxDelta);

            const isMoving = Math.abs(worldX) > 0.01 || Math.abs(worldZ) > 0.01;

            if (mode.mode === CONTROL_MODE.FACE_MOVE) {
                if(isMoving) {
                    // if (Number.isFinite(velocity.x) && Number.isFinite(velocity.z)) {
                    //     const targetYaw = Math.atan2(velocity.x, velocity.z);

                    //     if (Number.isFinite(targetYaw)) {
                    //         transform.rotY = dampAngle(transform.rotY, targetYaw, 12, deltaTime);
                    //     }
                    // }

                    // const targetYaw = Math.atan2(velocity.x, velocity.z);

                    // if (Number.isFinite(targetYaw)) {
                    //     transform.rotY = dampAngle(transform.rotY, targetYaw, 12, deltaTime);
                    // }

                    const targetYaw = Math.atan2(worldX, worldZ);
                    if (Number.isFinite(targetYaw)) {
                        transform.rotY = dampAngle(transform.rotY, targetYaw, 12, deltaTime);
                    }
                }
            }

            if (mode.mode === CONTROL_MODE.STRAFE) {
                // Face camera yaw
                // const cams = Query.entitiesWith(world, CameraRig);

                // if (cams.length > 0) {
                //     const rig = world.getComponent(cams[0], CameraRig);
                //     if (rig && Number.isFinite(rig.yaw)) {
                //         transform.rotY = rig.yaw;
                //     }
                // }

                const aim = world.getComponent(entity, Aim);
                if (aim && Number.isFinite(aim.yaw)) {
                    transform.rotY = aim.yaw;
                }
            }

            // ---- Jump logic (ground + coyote + buffer) ----

            //Update coyote timer
            if (grounded.isGrounded) {
                grounded.coyoteTimer = 0;
            } else {
                grounded.coyoteTimer += deltaTime;
            }

            const canCoyoteJump = grounded.coyoteTimer <= setting.coyoteSeconds;
            const jumpBuffered = input.jumpBufferTimer !== null
                && input.jumpBufferTimer <= setting.jumpBufferSeconds;

            if (jumpBuffered && (grounded.isGrounded || canCoyoteJump)) {
                velocity.y = setting.jumpSpeed;
                grounded.isGrounded = false; // we are now airborne
                input.jumpBufferTimer = Infinity; // consume the buffer
                input.jumpPressed = false; // consume press
            }

            // short hop (release jump early)
            if (input.jumpReleased && velocity.y > 0) {
                velocity.y *= 0.5;
            }


        }
    }
}