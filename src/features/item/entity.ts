import { Armor, BOOTS, CHESTPLATE, getSetArmor, getSetToughness, HELMET, LEGGINGS, make, NONE } from "./armor";
import { ABSORPTION, Effect, getEffect, getEffectLevel, HEALTH_BOOST, RESISTANCE } from "./effects";
const nomar = require('nomar');
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
export function maxHealth(e: Entity) {
    return 20 + (getEffectLevel(e.effects, HEALTH_BOOST.key) * 4) +
        (getEffectLevel(e.effects, ABSORPTION.key) * 4);
}
export function summary(e : Entity) {
    let str = "";
    str += e.armor[0].type.charAt(0) + "/" + e.armor[1].type.charAt(0) +  "/" + 
    e.armor[2].type.charAt(0) + "/" + e.armor[3].type.charAt(0);
    str += " A: " + getSetArmor(e.armor);
    str += " T: " + getSetToughness(e.armor);
    if (getEffect(e.effects, RESISTANCE.key)) {
        str += " R: " + nomar(getEffect(e.effects, RESISTANCE.key)!.value);
    }
    str += " HP: " + maxHealth(e);
    return str;
}
export function removeSetup(setups : Entity[], i : number) {
    setups.splice(i, 1);
}
export function getDefaultSetup() {
    return {
        armor: [make(NONE, HELMET, []),make(NONE, CHESTPLATE, []),
                make(NONE, LEGGINGS, []),make(NONE, BOOTS, [])],
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