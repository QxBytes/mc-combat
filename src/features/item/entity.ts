import { Armor } from "./armor";
import { Effect } from "./effects";


export interface Entity {
    armor: Armor[],
    effects: Effect[],
    family: string
}
export function getHelmet(e : Entity) : Armor {
    return e.armor[0];
}
export function getChestplate(e : Entity) : Armor {
    return e.armor[1];
}
export function getLeggings(e : Entity) : Armor {
    return e.armor[2];
}
export function getBoots(e : Entity) : Armor {
    return e.armor[3];
}

/*
export class Entity {
    constructor (
        public armor : Armor[],
        public effects : Map<string, number>,
        public family : string
    ) {
        
    }
    getHelmet() : Armor {
        return this.armor[0];
    }
    getChestplate() : Armor {
        return this.armor[1];
    }
    getLeggings() : Armor {
        return this.armor[2];
    }
    getBoots() : Armor {
        return this.armor[3];
    }
}
*/