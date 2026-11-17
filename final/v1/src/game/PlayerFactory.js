import * as THREE from "three";
import { Transform } from "../components/Transform.js";
import { Velocity } from "../components/Velocity.js";
import { Mesh } from "../components/Mesh.js";
import { Health } from "../components/Health.js";
import { Input } from "../components/Input.js";
import { PlayerControlled } from "../components/PlayerControlled.js";
import { ControllerSettings } from "../components/ControllerSetting.js";
import { Grounded } from "../components/Grounded.js";
import { ColliderAABB } from "../components/ColliderAABB.js";
import { DynamicBody } from "../components/DynamicBody.js";
import { CapsuleCollider } from "../components/CapsuleCollider.js";
import { ControlMode } from "../components/ControlMode.js";
import { Aim } from "../components/Aim.js";
import { CameraBasis } from "../components/CameraBasis.js";

//Factories => will handle entity creation

export function createPlayer(world, scene) {
    const entity = world.createEntity();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    // Acréscimo de sombras
    mesh.castShadow = true;

    scene.add(mesh);

    world.addComponent(entity, new Transform(0, 5, 0));
    world.addComponent(entity, new Velocity());
    world.addComponent(entity, new Mesh(mesh));
    world.addComponent(entity, new Health(100));
    world.addComponent(entity, new PlayerControlled());
    world.addComponent(entity, new Input());
    world.addComponent(entity, new ControllerSettings());
    world.addComponent(entity, new Grounded());
    world.addComponent(entity, new DynamicBody());
    world.addComponent(entity, new CapsuleCollider(0.4, 1.2));
    world.addComponent(entity, new ControlMode());
    world.addComponent(entity, new Aim());
    world.addComponent(entity, new CameraBasis());
    // world.addComponent(entity, new ColliderAABB(0.5, 0.5, 0.5));

    return entity;
}