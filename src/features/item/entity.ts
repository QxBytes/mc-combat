import { Armor, getSetArmor, getSetToughness } from "./armor";
import { Effect } from "./effects";
export const MAX_SETUPS = 8;

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
export function summary(e : Entity) {
    let str = "";
    str += e.armor[0].type.charAt(0) + "/" + e.armor[1].type.charAt(0) +  "/" + 
    e.armor[2].type.charAt(0) + "/" + e.armor[3].type.charAt(0);
    str += " Armor: " + getSetArmor(e.armor);
    str += " Tough: " + getSetToughness(e.armor);
    return str;
}
export function removeSetup(setups : Entity[], i : number) {
    setups.splice(i, 1);
}
export function getDefaultSetup() {
    return {
        armor: [],
        effects: [],
        family: "player"
    };
}
export function maxSetups(setups : Entity[]) : boolean {
    return setups.length >= MAX_SETUPS;
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