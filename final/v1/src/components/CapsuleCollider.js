import { Component } from "../ecs/Component.js";

export class CapsuleCollider extends Component {
    constructor(radius = 0.4, height = 1.2) {
        super();
        this.radius = radius;
        this.height = height; // altura do cilindro (sem incluir os cantos arredondados)
    }

    get halfHeight() {
        return this.height * 0.5;
    }
}