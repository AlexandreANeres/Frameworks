import { Component } from "../ecs/Component.js";

export class ColliderAABB extends Component {
    constructor(halfX = 0.5, halfY = 0.5, halfZ = 0.5) {
        super();
        this.halfX = halfX;
        this.halfY = halfY;
        this.halfZ = halfZ;
    }
}