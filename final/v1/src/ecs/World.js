export class World { //stores entities and components
    constructor() {
        this.nextEntityId = 0;
        this.entities = new Set(); //entidades ou personagens 
        this.components = new Map(); //mapa é referencial de posição
        this.systems = [];
    }

    createEntity() {
        const id = this.nextEntityId++; //o novo id sempre é maior que o anterior
        this.entities.add(id); //adiciona-o na lista de entidades
        return id;
    }

    destroyEntity(entity) {
        this.entities.delete(entity);
        for (const componentMap of this.components.values()) {
            componentMap.delete(entity); //deleta a entidade de todos os componentes vinculados
        }
    }

    addComponent(entity, component) {
        const type = component.constructor; //captura o tipo do componente
        if (!this.components.has(type)) { //se o componente não tiver tipo
            this.components.set(type, new Map()); //inserir ao tipo posição referencial
        }
        this.components.get(type).set(entity, component); //vincula-o à uma entidade
    }

    removeComponent(entity, componentType) {
        const componentMap = this.components.get(componentType);
        if (componentMap) {
            componentMap.delete(entity); //remove a associação
        }
    }

    getComponent(entity, componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? componentMap.get(entity) : undefined; //retorna o componente de uma entidade, ou indefinido por operador ternário
    }

    hasComponent(entity, componentType) {
        const componentMap = this.components.get(componentType);
        return componentMap ? componentMap.has(entity) : false; //valida se a entidade tem determinado componente
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(deltaTime) {
        for (const system of this.systems) {
            system.update(this, deltaTime);
        }
    }
}