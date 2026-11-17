// só recebe a data e armazena

import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Input } from "../components/Input.js";
import { PlayerControlled } from "../components/PlayerControlled.js";

export class InputSystem extends System {
    constructor() {
        super();
        this.keys = {};

        window.addEventListener("keydown", e => {
            this.keys[e.code] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.code] = false;
        });
    }

    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, PlayerControlled, Input);

        for (const entity of entities) {
            const input = world.getComponent(entity, Input);

            // Reset one-frame flags
            input.clearFrameFrags();

            // Move axes
            const left = this.keys["KeyA"] ? 1 : 0;
            const right = this.keys["KeyD"] ? 1 : 0;
            const up = this.keys["KeyW"] ? 1 : 0;
            const down = this.keys["KeyS"] ? 1 : 0;

            input.moveX = right - left;
            input.moveZ = down - up;

            // Run
            input.runHeld = !!this.keys["ShiftLeft"]; //a dupla exclamação é um operador lógico dito "double bang", em que eu faço uma dupla negação que confirma que o valor é booleano. Se var = "Maria", e eu fizer um return !!var; Ele retorna TRUE pois a string não é vazia. Se var = 0, e eu fizer um return !!0; Ele retorna falso pois zero é expressão para falso em booleano. Se var = false, e eu fizer um return !!var; Ele retorna a própria expressão booleana, false. 

            // Jump pressed/released tracking
            const jumpNow = !!this.keys["Space"];

            if (jumpNow && !input.jumpHeld) {
                input.jumpPressed = true;
                input.jumpBufferTimer = 0; // start buffer
            }

            if (!jumpNow && input.jumpHeld) {
                input.jumpReleased = true;
            }

            input.jumpHeld = jumpNow;

            //Update jump buffer timer (counts up)
            if (input.jumpBufferTimer !== null) {
                input.jumpBufferTimer += deltaTime;
            }

            const toggleNow = !!this.keys["KeyC"]; // C to toggle control style

            if (toggleNow && !input.toggleModeHeld) {
                input.toggleModePressed = true;
            }

            input.toggleModeHeld = toggleNow;
        }
    }
}