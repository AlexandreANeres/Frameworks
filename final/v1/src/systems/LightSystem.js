import * as THREE from "three";
import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { AmbientLightComponent } from "../components/AmbientLightComponent.js";
import { DirectionalLightComponent } from "../components/DirectionalLightComponent.js";
import { LightHandle } from "../components/LightHandle.js";

export class LightSystem extends System {
    constructor(scene) {
        super();
        this.scene = scene;
    }

    update(world, deltaTime) {
        // Ambient lights
        const ambients = Query.entitiesWith(world, AmbientLightComponent);

        for (const e of ambients) {
            const data = world.getComponent(e, AmbientLightComponent);
            let handle = world.getComponent(e, LightHandle);

            if(!handle) {
                const light = new THREE.AmbientLight(data.color, data.intensity);
                this.scene.add(light);
                world.addComponent(e, new LightHandle(light));
                handle = world.getComponent(e, LightHandle);
            }

            handle.light.color.setHex(data.color);
            handle.light.intensity = data.intensity;
        }

        // Directional lights
        const directionals = Query.entitiesWith(world, DirectionalLightComponent, Transform);

        for (const e of directionals) {
            const data = world.getComponent(e, DirectionalLightComponent);
            const transform = world.getComponent(e, Transform);
            let handle = world.getComponent(e, LightHandle);

            if(!handle) {
                const light = new THREE.DirectionalLight(data.color, data.intensity);
                light.castShadow = data.castShadow;

                light.shadow.mapSize.height = data.shadowMapSize;

                // Set a basic orthographic shadow camera volume
                const s = data.shadowCameraSize;
                light.shadow.camera.left = -s;
                light.shadow.camera.right = s;
                light.shadow.camera.top = s;
                light.shadow.camera.bottom = -s;

                light.shadow.bias = data.shadowBias;

                this.scene.add(light);
                world.addComponent(e, new LightHandle(light));
                handle = world.getComponent(e, LightHandle);
            }

            handle.light.color.setHex(data.color);
            handle.light.intensity = data.intensity;
            handle.light.position.set(transform.x, transform.y, transform.z);
        }

    }
}