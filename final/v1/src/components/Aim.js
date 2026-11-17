import { Component } from "../ecs/Component.js";

export class Aim extends Component {
    constructor() {
        super();
        this.yaw = 0; // Radians
    }
}