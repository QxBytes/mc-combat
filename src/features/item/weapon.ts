import { Item } from "./item";
import { bound } from "./maths";
import * as e from "./enchants";

//cooldown T = 20 / attackSpeed
export interface Weapon extends Item {
    damage: number,
    attackSpeed: number,
    getDamage: () => number,
    getEnchantDamage: () => number
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