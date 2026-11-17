export class Query {
    static entitiesWith(world, ...componentClasses) {
        if (componentClasses.length === 0) return [...world.entities];

        let smallest = null;

        for (const componentClass of componentClasses) {
            const componentMap = world.components.get(componentClass);
            if (!componentMap) return [];
            if (!smallest || componentMap.size < smallest.size) smallest = componentMap;
        }

        const result = [];

        for (const entity of smallest.keys()) {
            if (componentClasses.every(componentClass => world.hasComponent(entity, componentClass))) {
                result.push(entity);
            }
        }

        return result;
    }
}

//Ela pega todas as entidades do mundo e filtra aquelas que possuem todos os componentes passados.