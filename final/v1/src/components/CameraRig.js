import { Component } from "../ecs/Component.js";

export class CameraRig extends Component {
    constructor() {
        super();
        this.yaw = 0; // left | right
        this.pitch = 0; // up | down
        this.distance = 5;

        this.minPitch = -1.2;
        this.maxPitch = 0.8;
        this.minDistance = 2;
        this.maxDistance = 10;
    }
}