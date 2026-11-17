import { Component } from "../ecs/Component.js";

export class CameraFollow extends Component {
    constructor({
        offsetX = 0,
        offsetY = 3,
        offsetZ = 6,
        smoothness = 10,
        lookAtHeight = 1
    } = {}) {
        super();

        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.offsetZ = offsetZ;

        this.smoothness = smoothness;
        this.lookAtHeight = lookAtHeight; // the camera looks at the player upper body instead of the feet
    }
}