import { Component } from "../ecs/Component.js";

export class AmbientLightComponent extends Component {
    constructor(color = 0xffffff, intensity = 0.4) {
        super();
        this.color = color;
        this.intensity = intensity;
    }
}