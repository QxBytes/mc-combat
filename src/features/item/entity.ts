import { Armor } from "./armor";


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
