import { Component } from "../ecs/Component.js";

export class DirectionalLightComponent extends Component {
    constructor(color = 0xffffff, intensity = 0.8) {
        super();
        this.color = color;
        this.intensity = intensity;

        // Shadow setting
        this.castShadow = true;
        this.shadowMapSize = 2048;
        this.shadowCameraSize = 8;
        this.shadowBias = -0.0001;
    }
}