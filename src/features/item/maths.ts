import { Armor, getSetArmor, getSetEPF, getSetToughness } from "./armor";
import { Damage } from "./damage";
import { Entity } from "./entity";
import * as d from "./damageTypes";
import * as e from "./effects";

export function bound(value : number, min : number, max: number) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}
export function armorFactor(dmg: number, type: string, set: Armor[]) {
    if (type === d.MAGIC ||
        type === d.FALL ||
        type === d.FIRE) {
        return 1;
    }
    let def = getSetArmor(set);
    let tough = getSetToughness(set);
    return (1 - Math.min(20, Math.max( def/5, def - (4*dmg / (tough+8)) ))/25);
}
export function EPFFactor(type: string, set: Armor[]) {
    let epf = getSetEPF(set, type);
    return (1 - Math.min(epf, 20) / 25);
}
export function resistanceFactor(level: number) {
    return (1 - Math.min(level, 5)/5);
}
export function getStrengthBonus(level: number, kind: string) {
    if (kind !== d.MELEE) {
        return 0;
    }
    return 3 * level;
}
/**
 * 
 * @param dmg 
 * @param target 
 * @returns Damage taken after all effects, armor, enchants, etc. applied
 */
export function takeDamage(dmg : Damage, target : Entity) {
    let atk = dmg.getDamage();
    let type = dmg.type;
    console.log("Raw damage: " + atk);
    let afterArmor = atk * armorFactor(atk, type, target.armor);
    console.log("After armor: " + afterArmor);
    let afterEPF = afterArmor * EPFFactor(type, target.armor);
    console.log("After EPF: " + afterEPF);
    let afterResistance = afterEPF * resistanceFactor(target.effects.get(e.RESISTANCE)! || 0);
    return afterResistance;
}

