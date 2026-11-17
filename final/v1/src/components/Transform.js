import { Component } from "../ecs/Component.js";

export class Transform extends Component {
    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotY = 0;
    }
}

//posição x, y, z