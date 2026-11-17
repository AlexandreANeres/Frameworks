import './style.css'
import * as THREE from "three";
import { World } from './ecs/World.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { createPlayer } from './game/PlayerFactory.js';
import { InputSystem } from './systems/InputSystem.js';
import { RenderSystem } from './systems/RenderSystem.js';
import { PlayerControllerSystem } from './systems/PlayerControllerSystem.js';
import { GroundSystem } from './systems/GroundSystem.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { createFollowCamera } from './game/CameraFactory.js';
import { GravitySystem } from './systems/GravitySystem.js';
import { AABBCollisionSystem } from './systems/AABBCollisionSystem.js';
import { CapsuleVsAABBCollisionSystem } from './systems/CapsuleVsAABBCollisionSystem.js';
import { createGround } from './game/GroundFactory.js';
import { createWall } from './game/WallFactory.js';
import { LightSystem } from './systems/LightSystem.js';
import { createAmbientLight, createDirectionalLight } from './game/LightFactory.js';
import { ModeSwitchSystem } from './systems/ModeSwitchSystem.js';
import { MouseLookSystem } from './systems/MouseLookSystem.js';
import { OrbitCameraSystem } from './systems/OrbitCameraSystem.js';
import { CameraBasisSystem } from './systems/CameraBasisSystem.js';
import { CameraAimSystem } from './systems/CameraAimSystem.js';

// ---- UTILE ----
const width = window.innerWidth;
const height = window.innerHeight;

// ---- CANVAS ----
const canvas = document.getElementById("game");

// ---- THREE.JS ----
const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(3);

scene.add(axes);
axes.visible = false; //tira os eixos

const grid = new THREE.GridHelper(50, 50);
scene.add(grid);

const camera = new THREE.PerspectiveCamera(
  75,
  width / height,
  0.1,
  1000
);

camera.position.z = 5;
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x202030, 1);

// Para as sombras

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
scene.fog = new THREE.Fog(0x202030, 10, 35);

// ---- ECS ----
const world = new World();

//primeiro vem o input, a chamada para a ação
//segundamente vem a tradução desses dados em informações legíveis pelo sistema
//depois o sistema de movimentos acrescenta lógica de física e dinâmica
//por fim, e só ultimamente, as informações são renderizados

//Ou seja, a pipeline é: INPUT -> CONTROLLER -> PHYSICS && MOVEMENT -> RENDERING
//A ordem em que os sistemas são adicionados IMPORTA.

// 1) INPUT (collects raw input)
world.addSystem(new InputSystem());
world.addSystem(new MouseLookSystem(renderer.domElement)); // NEW (camera mouse input)

// 2) MODE | STATE
world.addSystem(new ModeSwitchSystem());

// 3) CONTROLLERS (turn intent into velocity)
world.addSystem(new PlayerControllerSystem());

// 4) FORCES
world.addSystem(new GravitySystem());

// 5) INTEGRATION (apply velocity to position)
world.addSystem(new MovementSystem());

// 6) COLLISION (resolve penetrations, adjust position & velocity)
world.addSystem(new CapsuleVsAABBCollisionSystem()); // player vs world
// world.addSystem(new GroundSystem());
world.addSystem(new AABBCollisionSystem()); // other boxes, props, etc

// 7) CAMERA (must run AFTER movement & collisions)
world.addSystem(new OrbitCameraSystem(camera));
world.addSystem(new CameraBasisSystem());
world.addSystem(new CameraAimSystem());

// 8) LIGHTING (follow camera or scene)
world.addSystem(new LightSystem(scene));

// 9) RENDER (last, always)
world.addSystem(new RenderSystem(renderer, scene, camera));

//cria o player
const player = createPlayer(world, scene);

//cria a câmera
createFollowCamera(world, player);

//cria o chão
createGround(world, scene);

//cria paredes
createWall(world, scene, { x: 0, y: 0.5, z: 6, w: 10, h: 1, d: 1});
createWall(world, scene, { x: -6, y: 0.5, z: 0, w: 1, h: 1, d: 10});
createWall(world, scene, { x: 6, y: 0.5, z: 0, w: 1, h: 1, d: 10});

//cria as luzes
createAmbientLight(world, { intensity: 0.35 });
createDirectionalLight(world, { x: 6, y: 12, z: 6, intensity: 0.9 });

//computa quantas entidade foram criadas na cena
console.log("scene children count: ", scene.children.length);

// ---- RESIZE HANDLING ----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// ---- DEBUG TOGGLE ----

window.addEventListener("keydown", e => {
  if (e.code === "KeyH") {
    axes.visible = !axes.visible;
  }
});

document.addEventListener("pointerlockchange", () => {
  document.body.classList.toggle(
    "locked",
    document.pointerLockElement === renderer.domElement
  );
});

// ---- GAME LOOP ----
let lastTime = performance.now();

function gameLoop() {
  const now = performance.now();
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  // movementSystem.update(world, deltaTime);

  // renderer.render(scene, camera);
  world.update(deltaTime);
  requestAnimationFrame(gameLoop);
}

gameLoop();

//ECS stands for Entity Component System

//Entity is just an ID
//Component is data only
//System is the logic that act on data
