import { Component } from "../ecs/Component.js";

export class Grounded extends Component {
    constructor() {
        super();
        this.isGrounded = true;
        this.coyoteTimer = 0;
    }
}