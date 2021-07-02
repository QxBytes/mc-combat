import { Armor, getSetArmor, getSetEPF, getSetToughness } from "./armor";
import { Damage } from "./damage";
import { Entity } from "./entity";
import * as d from "./damageTypes";
import * as e from "./effects";
import { getEffect, getEffectLevel } from "./effects";
import functionPlot from "function-plot";

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
    if (!affectedByArmor(type)) {
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

export function affectedByArmor(type : string) {
    if (type === d.MAGIC ||
        type === d.FALL ||
        type === d.FIRE) {
        return false;
    }
    return true;
}
/**
 * 
 * @param dmg 
 * @param target 
 * @returns Damage taken after all effects, armor, enchants, etc. applied
 */
export function takeDamage(dmg : Damage, target : Entity, legacy? : boolean) {
    /*
    let atk = dmg.amount;
    let type = dmg.type;
    //console.log("Damage type: " + type);
    //console.log("Raw damage: " + atk);
    //HEY ATK IS AT THE FRONT!
    let afterArmor = atk * armorFactor(atk, type, target.armor);
    //console.log("After armor: " + afterArmor);
    let afterEPF = afterArmor * EPFFactor(type, target.armor);
    //console.log("After EPF: " + afterEPF);
    let afterResistance = afterEPF * resistanceFactor(getEffectLevel(target.effects, e.RESISTANCE) || 0);
    */
    return functionPlot.$eval.builtIn(
        {fn: damageEquation(dmg, target, legacy)}, 'fn', {x:dmg.amount});
    
    //return afterResistance;
}
export function damageEquation(dmg: Damage, target : Entity, legacy? : boolean) : string {
    if (legacy) {
        return damageEquationLegacy(dmg, target);
    }
    let EPF = EPFFactor(dmg.type, target.armor);
    let res = resistanceFactor(getEffectLevel(target.effects, e.RESISTANCE) || 0);
    let def = getSetArmor(target.armor);
    let tough = getSetToughness(target.armor);
    if (affectedByArmor(dmg.type)) {
        return "x * (1 - min(20, max( " + def + "/5, " + def + "- (4*x / (" + tough + "+8)) ))/25) * " 
        + EPF + " * " + res;
    } else {
        return "x * " + EPF + " * " + res;
    }
}
function damageEquationLegacy(dmg: Damage, target: Entity) : string {
    let EPF = EPFFactor(dmg.type, target.armor);
    let res = resistanceFactor(getEffectLevel(target.effects, e.RESISTANCE) || 0);
    let def = getSetArmor(target.armor);
    if (affectedByArmor(dmg.type)) {
        return "x * (1 -  (" + (def * 4)  + ") *"
        + EPF + " * " + res;
    } else {
        return "x * " + EPF + " * " + res;
    }
}
