import * as THREE from "three";
import { Transform } from "../components/Transform.js";
import { Mesh } from "../components/Mesh.js";
import { ColliderAABB } from "../components/ColliderAABB.js";
import { StaticBody } from "../components/StaticBody.js";

export function createWall(world, scene, { x = 0, y = 0.5, z = -5, w = 6, h = 1, d = 1} = {}) {
    const entity = world.createEntity();

    // Visual
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshStandardMaterial({ metalness: 0, roughness: 0.9 });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, z);

    // Acréscimo de sombras
    box.castShadow = true;
    box.receiveShadow = true;

    scene.add(box);

    // ECS data
    world.addComponent(entity, new Transform(x, y, z));
    world.addComponent(entity, new Mesh(box));
    world.addComponent(entity, new StaticBody());

    // Collider half sizes
    world.addComponent(entity, new ColliderAABB(w / 2, h /2, d / 2));

    return entity;

}