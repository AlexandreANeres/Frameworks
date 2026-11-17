import { Component } from "../ecs/Component.js";

export const CONTROL_MODE = {
    FACE_MOVE: "FACE_MOVE",
    STRAFE: "STRAFE"
};

export class ControlMode extends Component {
    constructor(mode = CONTROL_MODE.FACE_MOVE) {
        super();
        this.mode = mode;
    }
}