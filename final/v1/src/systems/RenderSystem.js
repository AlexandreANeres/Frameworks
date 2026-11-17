import { System } from "../ecs/System.js";
import { Query } from "../ecs/Query.js";
import { Transform } from "../components/Transform.js";
import { Mesh } from "../components/Mesh.js";

export class RenderSystem extends System {
    constructor(renderer, scene, camera) {
        super();
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

    update(world, deltaTime) {
        const entities = Query.entitiesWith(world, Transform, Mesh);

        for (const entity of entities) {
            const transform = world.getComponent(entity, Transform);
            const meshComponent = world.getComponent(entity, Mesh);

            meshComponent.mesh.rotation.y = transform.rotY;

            meshComponent.mesh.position.set(
                transform.x,
                transform.y,
                transform.z
            );
        }
        this.renderer.render(this.scene, this.camera);
    }
}