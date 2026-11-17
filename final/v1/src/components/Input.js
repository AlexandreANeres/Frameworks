import { Component } from "../ecs/Component.js";

export class Input extends Component {
    constructor() {
        super();

        // Axis intent (raw) in range -1..1
        this.moveX = 0;
        this.moveZ = 0;

        // Held state
        this.runHeld = false;
        this.jumpHeld = false;
        this.toggleModeHeld = false;

        // Pre-frame events
        this.jumpPressed = false; //true only on the frame the key was pressed
        this.jumpReleased = false; // true only on the frame the key was released
        this.toggleModePressed = false;

        // Timestamp-style buffering (we are using a simples timer)
        this.jumpBufferTimer = null;

        this.toggleModePressed = false;
        this.toggleModeHeld = false;
    }

    // Called once per frame to reset one-frame flags
    clearFrameFrags() {
        this.jumpPressed = false;
        this.jumpReleased = false;
        this.toggleModePressed = false;

        this.toggleModePressed = false;
    }
}