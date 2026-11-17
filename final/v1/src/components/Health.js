import { Component } from "../ecs/Component.js";

export class Health extends Component {
    constructor(max) {
        super();
        this.max = max; //vida maxima
        this.current = max; //vida atual
    }
}