import { Item } from "../item/item";
import { bound } from "../item/maths";
import * as e from "../item/enchants";
import { DIAMOND, IRON, GOLDEN, NETHERITE, NONE } from "../item/armor";
import { Effect, getEffectLevel, makeEffect, setEffect, STRENGTH, WEAKNESS } from "../item/effects";
import functionPlot from "function-plot";
const _ = require('lodash');
const nomar = require('nomar');
//cooldown T = 20 / attackSpeed
export interface Weapon {
    damage: number,
    attackSpeed: number,
    ticksSinceLast: number,
    critical: boolean,
    sharpness: number,
    effects: Effect[],
    material: string,
    type: string
}

export const STONE = 'Stone';
export const WOODEN = 'Wood';


export const SWORD = 'Sword';
export const TRIDENT = 'Trident';
export const SHOVEL = 'Shovel';
export const PICKAXE = 'Pickaxe';
export const AXE = 'Axe';
export const HOE = 'Hoe';
export const FIST = 'Fist';

export const WEAPON_DATA = new Map([
    [SWORD,[4,4,5,6,7,8]],
    [TRIDENT,[9,9,9,9,9,9]],
    [SHOVEL,[2.5,2.5,3.5,4.5,5.5,6.5]],
    [PICKAXE,[2,2,3,4,5,6]],
    [AXE,[7,7,9,9,9,10]],
    [HOE,[1,1,1,1,1,1]],
    [FIST,[1,1,1,1,1,1]]

]);
export const WEAPONS = [SWORD, TRIDENT, SHOVEL, PICKAXE, AXE, HOE, FIST];
export const MATERIALS = [NETHERITE, DIAMOND, IRON, GOLDEN, STONE, WOODEN];

export const WEAPON_MATERIALS = new Map([
    [SWORD, MATERIALS],
    [TRIDENT, [NONE]],
    [SHOVEL, MATERIALS],
    [PICKAXE, MATERIALS],
    [AXE, MATERIALS],
    [HOE, MATERIALS],
    [FIST, [NONE]]

]);

export const WEAPON_SPEEDS = new Map([
    [SWORD, [1.6,1.6,1.6,1.6,1.6,1.6]],
    [TRIDENT, [1.1,1.1,1.1,1.1,1.1,1.1]],
    [SHOVEL, [1,1,1,1,1,1]],
    [PICKAXE, [1.2,1.2,1.2,1.2,1.2,1.2]],
    [AXE, [.8,1,.8,.9,1,1]],
    [HOE, [1,1,2,3,4,4]],
    [FIST, [4,4,4,4,4,4]]

]);
export function makeWeapon(type: string, material: string, ticksSinceLast: number, 
    critical: boolean, sharpness: number, strength: number, weakness: number) : Weapon {
    let temp : Weapon = {
        type: type,
        material: material,
        damage: 0,
        attackSpeed: 1,
        ticksSinceLast: ticksSinceLast,
        critical: critical,
        sharpness: sharpness,
        effects: []
    }
    if (strength) {
        setEffect(temp.effects, STRENGTH.key, strength);
    }
    if (weakness) {
        setEffect(temp.effects, WEAKNESS.key, weakness);
    }
    preset(temp, type, material);
    return temp;
}
export function defaultWeapon() : Weapon{
    return makeWeapon("Sword", "Netherite", 14, true, 5, 2, 0);
}
export function preset(w: Weapon, type: string, material: string) {
    w.damage = weaponPreset(type, material);
    w.attackSpeed = weaponSpeedPreset(type, material);
    w.type = type;
    w.material = material;
}
export function weaponPreset(type: string, material: string) {
    return indexInto(WEAPON_DATA, type, material);
}
export function weaponSpeedPreset(type: string, material: string) {
    return indexInto(WEAPON_SPEEDS, type, material);
}
export function fullChargeDamage(w: Weapon) {
    const x: Weapon = _.cloneDeep(w);
    x.ticksSinceLast = 100; //5 seconds should be long enough for any weapon to recharge
    return getDamage(x);
}
function indexInto(map: Map<string, number[]>, key: string, material: string) {
    if (material === WOODEN) {
        return map.get(key)![0];
    } else if (material === GOLDEN) {
        return map.get(key)![1];
    } else if (material === STONE) {
        return map.get(key)![2];
    } else if (material === IRON) {
        return map.get(key)![3];
    } else if (material === DIAMOND) {
        return map.get(key)![4];
    } else if (material === NETHERITE) {
        return map.get(key)![5];
    }
    return map.get(key)![0];
}
export function getEnchantModifier(w: Weapon) : number {
    /*
    if (w.type === AXE || w.type === SWORD) {
        let val = w.sharpness || 0;
        if(val) {
            if (val === 1) {
                val = 1;
            } else {
                val = (val - 1) * 0.5 + 1;
            }
        }
        //enchantment penalty
        let T = 20 / w.attackSpeed;
        let multiplier = bound((w.ticksSinceLast+0.5) / T, 0, 1);
        return val * multiplier;
    }
    return 0;
    */
    return functionPlot.$eval.builtIn(
        {fn: getEnchantEquation(w)}, 'fn', {x:w.ticksSinceLast});
}
export function getEnchantEquation(w: Weapon) : string {
    if (w.type === AXE || w.type === SWORD) {
        let val = w.sharpness || 0;
        if(val) {
            if (val === 1) {
                val = 1;
            } else {
                val = (val - 1) * 0.5 + 1;
            }
        }
        //enchantment penalty
        let T = 20 / w.attackSpeed;
        let eq = "(" + val + " * min( (x +0.5) / " + T + ", 1) )";
        return eq;
    }
    return '0';
}

export function getDamageMultiplier(w : Weapon) : number {
    /*
    let T = 20 / w.attackSpeed;
    let multiplier = 0.2 + ((w.ticksSinceLast + 0.5) / T)**2 * 0.8;
    multiplier = bound(multiplier, .2, 1);
    */
    return functionPlot.$eval.builtIn(
        {fn: getDamageMultiplierEquation(w)}, 'fn', {x:w.ticksSinceLast});
}
export function getDamageMultiplierEquation(w : Weapon) : string {
    let T = 20 / w.attackSpeed;
    let multiplier = "min(0.2 + ((x + 0.5) /" +  T + ")^2 * 0.8, 1)";
    return multiplier;
}

export function getStrengthBonus(w: Weapon) {
    return 3 * (getEffectLevel(w.effects, STRENGTH.key) || 0);
}
export function getWeaknessBonus(w: Weapon) {
    return -(4 * (getEffectLevel(w.effects, WEAKNESS.key) || 0));
}

export function getCriticalMultiplier(w : Weapon) : number {
    return functionPlot.$eval.builtIn(
        {fn: getCriticalEquation(w)}, 'fn', {x:w.ticksSinceLast});
}
export function getCriticalEquation(w : Weapon) : string {
    //Positive = Critical OK
    //Negative = No critical allowed
    // 0 or +1 /2 --> [0,.5] --> [1, 1.5]
    if (w.critical) {
        return "(max(0, sign(" + getDamageMultiplierEquation(w) + "- .848))/2 + 1)";
    }
    return "1";
}
export function getDamage(w : Weapon): number {
    
    /*let multiplier = getDamageMultiplier(w);
    return (w.damage * multiplier + getStrengthBonus(w) + getWeaknessBonus(w)) 
    * getCriticalMultiplier(w) + getEnchantModifier(w); */
    return functionPlot.$eval.builtIn(
        {fn: getDamageEquation(w)}, 'fn', {x:w.ticksSinceLast});
}
export function getDamageEquation(w : Weapon): string {
    let multiplier = getDamageMultiplierEquation(w);
    let eq =  "(" + w.damage + "*(" + multiplier + ")+" + getStrengthBonus(w) + "+" + getWeaknessBonus(w)+
     ") *" + getCriticalEquation(w) + "+" + getEnchantEquation(w);
    //console.log("Damage vs time: " + eq);
     return eq;
}
export function getTicks(seconds: number) {
    return seconds * 20;
}
export function getSeconds(ticks: number) {
    return ticks / 20;
}
export function toString(w: Weapon) {
    let temp = "";
    if (w.type === TRIDENT || w.type === FIST) {
        temp += w.type + " · ";
    } else {
        temp += w.material + " " + w.type + " · ";
    }
    temp += w.ticksSinceLast + " · ";
    if (w.critical) {
        temp += "Critical · ";
    }
    if (w.sharpness) {
        temp += "Sharpness " + nomar(w.sharpness) + " · ";
    }
    if (getEffectLevel(w.effects, STRENGTH.key)) {
        temp += "Strength " + nomar(getEffectLevel(w.effects, STRENGTH.key)) + " · ";
    }  
    if (getEffectLevel(w.effects, WEAKNESS.key)) {
        temp += "Weakness " + nomar(getEffectLevel(w.effects, WEAKNESS.key)) + " · ";
    }
    return temp + " Melee"
}

/*
export class MeleeWeapon implements Weapon {
    constructor (
        public name: string,
        public damage : number,
        public attackSpeed : number,
        public ticksSinceLast : number,
        public enchantments : Map<string, number>
    ) {

    }
    getDamage() {
        let multiplier = this.getDamageMultiplier();
        return this.damage * multiplier;
    }
    getEnchantDamage() {
        return this.getEnchantModifier();
    }
    private getDamageMultiplier() : number {
        let T = 20 / this.attackSpeed;
        let multiplier = 0.2 + ((this.ticksSinceLast + 0.5) / T)**2 * 0.8;
        multiplier = bound(multiplier, .2, 1);
        return multiplier;
    }
    private getEnchantModifier() : number {
        let val = this.enchantments.get(e.SHARPNESS) || 0;
        if(val) {
            if (val === 1) {
                val = 1;
            } else {
                val = (val - 1) * 0.5 + 1;
            }
        }
        return val;
    }
}
*/