import { Component } from "../ecs/Component.js";

export class LightHandle extends Component {
    constructor(light) {
        super();
        this.light = light;
    }
}