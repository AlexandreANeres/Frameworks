import { Component } from "../ecs/Component.js";

export class ControllerSettings extends Component {
    constructor() {
        super();

        // Movement
        this.walkSpeed = 3;
        this.runSpeed = 6;
        this.acceleration = 25; // how fast velocity changes

        // Jump
        this.jumpSpeed = 7;
        this.jumpBufferSeconds = 0.12; // press jump slightly early
        this.coyoteSeconds = 0.10;     // jump slightly after leaving ground
    }
}