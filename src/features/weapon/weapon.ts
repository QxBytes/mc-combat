import { Item } from "../item/item";
import { bound } from "../item/maths";
import * as e from "../item/enchants";
import { DIAMOND, IRON, GOLDEN, NETHERITE } from "../item/armor";
//cooldown T = 20 / attackSpeed
export interface Weapon {
    damage: number,
    attackSpeed: number,
    ticksSinceLast: number,
    critical: boolean,
    sharpness: number,
    strength: number,
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
    critical: boolean, sharpness: number, strength: number) : Weapon {
    let temp = {
        type: type,
        material: material,
        damage: 0,
        attackSpeed: 1,
        ticksSinceLast: ticksSinceLast,
        critical: critical,
        sharpness: sharpness,
        strength: strength,
    }
    temp.damage = weaponPreset(type, material);
    temp.attackSpeed = weaponSpeedPreset(type, material);
    return temp;
}
export function weaponPreset(type: string, material: string) {
    return indexInto(WEAPON_DATA, type, material);
}
export function weaponSpeedPreset(type: string, material: string) {
    return indexInto(WEAPON_SPEEDS, type, material);
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
export function getStrengthBonus(w: Weapon) {
    return 3 * w.strength;
}
export function getDamageMultiplier(w : Weapon) : number {
    let T = 20 / w.attackSpeed;
    let multiplier = 0.2 + ((w.ticksSinceLast + 0.5) / T)**2 * 0.8;
    multiplier = bound(multiplier, .2, 1);
    return multiplier;
}
export function getDamage(w : Weapon): number {
    let multiplier = getDamageMultiplier(w);
    if (multiplier < .848 || w.critical === false) {
        return w.damage * multiplier + getStrengthBonus(w) + getEnchantModifier(w);
    } else {
        return (w.damage * multiplier + getStrengthBonus(w)) * 1.5 + getEnchantModifier(w);
    }
}
export function getTicks(seconds: number) {
    return seconds * 20;
}
export function getSeconds(ticks: number) {
    return ticks / 20;
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