import { compress } from "three/examples/jsm/libs/fflate.module.js";
import { Component } from "../ecs/Component.js";

export class StaticBody extends Component {
    constructor() {
        super(); //usado para acessar a classe pai
    }
}