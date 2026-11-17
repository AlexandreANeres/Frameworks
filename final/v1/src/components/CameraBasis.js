import { Component } from "../ecs/Component.js";

export class CameraBasis extends Component {
    constructor() {
        super();
        this.yaw = 0; // Radians
    }
}